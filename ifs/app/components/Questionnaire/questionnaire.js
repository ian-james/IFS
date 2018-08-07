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

	app.post('/questionnaire', function(req, res) {

		// query parameters to be used
		var date = req.body.dueDate;
		var assignment = req.body.assignment;
		var comfortLevel = req.body.comfortLevel;
		var userID = req.user.id;
		var numComp = 5;
		var assignId = 1;

		// insert query into the task_decompositoon_base table
		var question = TaskDecompBase.query()
		.insert({
			userId: userID,
			question: assignment,
			dueDate: date,
			comfort: comfortLevel,
			numComponents: numComp,
			assignmentId: assignId
		})
		.catch(function(err) { console.log(err.stack) });  

		// useless return, might want to change
		res.send(question);

   });
};
