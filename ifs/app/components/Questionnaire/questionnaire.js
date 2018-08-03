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


module.exports = function(app, iosocket) {

    app.post('/questionnaire', function(req, res) {

       var date = req.body.dueDate;
       var assignment = req.body.assignment;
       var comfortLevel = req.body.comfortLevel;
       var userID = req.user.id;
       var numComp = 5;
       var assignId = 1;

       var question = TaskDecompBase.query()
       .insert({
            question: assignment,
            dueDate: date,
            comfort: comfortLevel
       })
       .catch(function(err) { console.log(err.stack) })  

       console.log(question);
       res.send(question);


       // console.log(userId);


    });
};
