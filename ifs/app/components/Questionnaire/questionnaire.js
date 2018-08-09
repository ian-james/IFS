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
			{num: 'Question 1', text: 'What is the name of the assignment?', fields: [{type: 'text', placeholder: 'Assignment 1', model: ''}]},
			{num: 'Question 2', text: 'When is the assignment due?', fields: [{type: 'date', model: ''}]},
			{num: 'Question 3', text: 'How comfortable are you with this assignment?', fields: [{type: 'radio', model: 'Low', options: ['Low', 'Medium', 'High']}]}
		];

		// Query parameters to be used
		var userID = req.user.id;
		var assignId = 1;

		//Check if the user already has an entry in the database for this part of the questionnaire
		var result = await TaskDecompBase.query()
		.where('userId', userID)
		.andWhere('assignmentId', assignId)
		.catch(function(err) {
			res.send(list);
			console.log(err.stack);
			return;
		});

		//Add retrieved data to the list
		list[0].fields[0].model = result[0].question;
		list[1].fields[0].model = result[0].dueDate;
		list[2].fields[0].model = result[0].comfort;

		res.send(list);
	});
	
	app.post('/taskDecompBaseStore', async function(req, res) {
		// Query parameters to be used
		var date = req.body.dueDate;
		var assignment = req.body.assignment;
		var comfortLevel = req.body.comfortLevel;
		var userID = req.user.id;
		var numComp = 5;
		var assignId = 1;

		//Check if the user already has an entry in the database for this part of the questionnaire
		var result = await TaskDecompBase.query()
		.where('userId', userID)
		.andWhere('assignmentId', assignId);

		//If an entry exists, update it, otherwise create a new entry
		if (result[0]) {
			TaskDecompBase.query()
			.patch({
				question: assignment,
				dueDate: date,
				comfort: comfortLevel,
				numComponents: numComp
			})
			.where('userId', userID)
			.andWhere('assignmentId', assignId)
			.catch(function(err) { console.log(err.stack) });
		} else {
			TaskDecompBase.query()
			.insert({
				userId: userID,
				question: assignment,
				dueDate: date,
				comfort: comfortLevel,
				numComponents: numComp,
				assignmentId: assignId
			})
			.catch(function(err) { console.log(err.stack) });
		}

		// useless return, might want to change
		res.send(result);

   });
};
