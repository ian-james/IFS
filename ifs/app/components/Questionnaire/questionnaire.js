var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var _ = require('lodash');
var async = require('async');

var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var dbHelpers = require(__components + "Databases/dbHelpers");

var {TaskDecompBase} = require('../../models/taskDecompBase')
var {TaskDecompModule} = require('../../models/taskDecompModule')
var {TaskDecompTask} = require('../../models/taskDecompTask')


module.exports = function(app, iosocket) {
	app.get('/taskDecompRetrieve', async function(req, res) {
		//The default list to be sent. If anything goes wrong, this is what will be sent. Data is added as queries are done
		var list = [
			{num: 'Basic Task Decomposition', text: 'The following section will ask you questions about basic tasks in this assignment to help you break it down. You may exit this survey at any time.', fields: []},
			{num: 'Question 1', text: 'What is the name of the assignment?', fields: [{type: 'text', placeholder: 'Assignment 1', model: ''}]},
			{num: 'Question 2', text: 'When is the assignment due?', fields: [{type: 'date', model: ''}]},
			{num: 'Question 3', text: 'How comfortable are you with this assignment?', fields: [{type: 'radio', model: 'Low', options: ['Low', 'Medium', 'High']}]},
			{num: 'Assignment Module Decomposition', text: 'The following section will ask you questions about the modules in this assignment to help you break them down. You may exit this survey at any time.', fields: []},
			{num: 'Question 1', text: 'How many modules are there in this assignment?', feedsNext: 'moduleNames', fields: [{type: 'select', model: '1', label: 'Modules', options: ['1', '2', '3', '4', '5']}]},
			{num: 'Question 2', text: 'What are the names of these modules?', fed: 0, prevFed: 0, feedsNext: 'moduleDifficulty', fields: [{type: 'text', placeholder: 'Module name', model: ''}]},
			{num: 'Question 3', text: 'Rate the difficuly level of each of these modules:', fed: 0, prevFed: 0,  feedsNext: 'taskQuestions', fields: [{type: 'slider', label: '', model: 5}]},
		];

		// Query parameters to be used
		var userID = req.user.id;
		var assignId = 1; //TODO: this variable is dummy for now and needs to be associated with an actualy assignment ID

		//Check if the user already has an entry in the database for this part of the questionnaire
		var result = await TaskDecompBase.query()
		.where('userId', userID)
		.andWhere('assignmentId', assignId)
		.catch(function(err) {
			res.send({
				'list': list,
				'i': result[0].index
			});
			console.log(err.stack);
			return;
		});

		//Add retrieved data to the list
		list[1].fields[0].model = result[0].question;
		list[2].fields[0].model = result[0].dueDate;
		list[3].fields[0].model = result[0].comfort;
		var index = result[0].index;

		console.log('index', index);

		//If there were no results (the user has not had a chance to do this questionnaire before) then create a new entry and send default list
		if (result.length == 0) {
			TaskDecompBase.query()
			.insert({
				userId: userID,
				question: '',
				dueDate: new Date(),
				comfort: 'Low',
				numComponents: 0,
				assignmentId: assignId
			})
			.catch(function(err) {
				res.send({
					'list': list,
					'i': result[0].index
				});
				console.log(err.stack);
				return;
			});
		} else {
			var baseId = result[0].id;
			result = await TaskDecompModule.query()
			.where('baseId', baseId)
			.catch(function(err) {
				res.send({
					'list': list,
					'i': result[0].index
				});
				console.log(err.stack);
				return;
			});

			list[5].fields[0].model = '' + result.length;
			list[6].fed = list[6].prevFed = result.length;

			console.log(result.length);

			for (var i = 0; i < result.length; i++) {
				var name = result[i].name;
				var difficulty = result[i].difficulty;
				//var hours = parseInt(result[i].expectedLength.substring(1, 2));
				//var minutes = parseInt(result[i].expectedLength.substring(3, 5));

				list[6].fields[i] = {type: 'text', placeholder: 'Module name', model: name};
				list[7].fields[i] = {type: 'slider', label: name, model: difficulty};
				//list[8].fields[i] = {type: 'timeEstimate', label: name, model: [hours, minutes], hours: [1,2,3,4,5], minutes:[0,15,30,45]};
			}
		}

		res.send({
			'list': list,
			'i': index
		});
	});

	app.post('/taskDecompStore', async function(req, res) {
		var list = req.body.list;
		var i = req.body.i;

		// Query parameters to be used
		var date = list[2].fields[0].model.substring(0, 10) + ' 00:00:00';
		var assignment = list[1].fields[0].model;
		var comfortLevel = list[3].fields[0].model;
		var userID = req.user.id;
		var numComp = parseInt(list[5].fields[0].model);
		var assignId = 1; //TODO: this variable is dummy for now and needs to be associated with an actualy assignment ID

		//Update the base table
		await TaskDecompBase.query()
		.patch({
			question: assignment,
			dueDate: date,
			comfort: comfortLevel,
			index: i,
			numComponents: numComp
		})
		.where('userId', userID)
		.andWhere('assignmentId', assignId)
		.catch(function(err) { console.log(err.stack); });

		//Separate the modules and their corresponding tasks into a new list
		var taskList = [];
		var j = -1;
		for (i = 8; i < list.length; i++) {
			if (list[i].taskHeader) {
				j++
				taskList[j] = [];
			} else {
				taskList[j].push(list[i]);
			}
		}

		//Retrieve all time estimate sums from the task list for storage in module table
		var moduleTimes = [];
		for (var m of taskList) {
			moduleTimes.push([0,0]);
			for (var field of m[m.length-1].fields) {
				moduleTimes[moduleTimes.length - 1][0] += field.model[0];
				moduleTimes[moduleTimes.length - 1][1] += field.model[1];
			}
			moduleTimes[moduleTimes.length - 1][0] += Math.floor(moduleTimes[moduleTimes.length - 1][1] / 60);
			moduleTimes[moduleTimes.length - 1][1] = moduleTimes[moduleTimes.length - 1][1] % 60;
		}

		//Get the base id for finding all modules
		var result = await TaskDecompBase.query()
		.where('userId', userID)
		.andWhere('assignmentId', assignId)
		.catch(function(err) {
			console.log(err.stack);
		});

		var baseId = result[0].id;

		//Get the module IDs for removing all tasks
		result = await TaskDecompModule.query()
		.where('baseId', baseId)
		.catch(function(err) {
			console.log(err.stack);
		});

		//Remove all previously stored tasks from the database to replace them
		for (var r of result) {
			await TaskDecompTask.query()
			.delete()
			.where('moduleId', r.id)
			.catch(function(err) { console.log(err.stack); });
		}

		//Remove all previously stored modules from the database to replace them
		await TaskDecompModule.query()
		.delete()
		.where('baseId', baseId)
		.catch(function(err) { console.log(err.stack); });

		//For each module in the assignment, add the appropriate data as a new entry to the database
		for (var i = 0; i < numComp; i++) {
			var intialComf = taskList[i][0].fields[0].model;
			var endComf = intialComf;
			if (intialComf == 'No') endComf = taskList[i][3].fields[0].model;

			await TaskDecompModule.query()
			.insert({
				baseId: baseId,
				name: list[6].fields[i].model,
				expectedLength: moduleTimes[i][0]+':'+moduleTimes[i][1]+':00',
				difficulty: list[7].fields[i].model,
				initialComfort: intialComf,
				endComfort: endComf
			})
			.catch(function(err) { console.log(err.stack); });
		}

		//Get the module IDs for storing tasks for each module
		result = await TaskDecompModule.query()
		.where('baseId', baseId)
		.catch(function(err) {
			console.log(err.stack);
		});

		//Store all tasks in the database
		for (var m in taskList) {
			var numTasks = parseInt(taskList[m][1].fields[0].model);
			for (var i = 0; i < numTasks; i++) {
				var time = taskList[m][taskList[m].length-1].fields[0].model;

				await TaskDecompTask.query()
				.insert({
					moduleId: result[m].id,
					tasks: taskList[m][2].fields[i].model,
					expectedLength: time[0]+':'+time[1]+':00'
				})
				.catch(function(err) { console.log(err.stack); });
			}
		}
   });
};
