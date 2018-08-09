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
			{num: 'Assignment Module Decomposition', text: 'The following section will ask you questions about the modules in this assignment to help you break them. You may exit this survey at any time.', fields: []},
			{num: 'Question 1', text: 'How many modules are there in this assignment?', fields: [{type: 'select', model: '1', label: 'Modules', options: ['1', '2', '3', '4', '5']}]}
		];

		// Query parameters to be used
		var userID = req.user.id;
		var assignId = 1;

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
			.catch(function(err) { console.log(err.stack) });

			res.send({
				'list': list,
				'i': result[0].index
			});
			return;
		}

		//Add retrieved data to the list
		list[1].fields[0].model = result[0].question;
		list[2].fields[0].model = result[0].dueDate;
		list[3].fields[0].model = result[0].comfort;

		res.send({
			'list': list,
			'i': result[0].index
		});
	});

	app.post('/taskDecompStore', async function(req, res) {
		var list = req.body.list;
		var i = req.body.i;

		// Query parameters to be used
		console.log(typeof list[2].fields[0].model);
		var date = list[2].fields[0].model.substring(0, 10) + ' 00:00:00';
		var assignment = list[1].fields[0].model;
		var comfortLevel = list[3].fields[0].model;
		var userID = req.user.id;
		var numComp = 5;
		var assignId = 1;

		//Update the base table
		TaskDecompBase.query()
		.patch({
			question: assignment,
			dueDate: date,
			comfort: comfortLevel,
			index: i,
			numComponents: numComp
		})
		.where('userId', userID)
		.andWhere('assignmentId', assignId)
		.catch(function(err) { console.log(err.stack) });
   });
};
