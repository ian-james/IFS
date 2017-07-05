var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var async = require('async');
var _ = require('lodash');

var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var dbHelpers = require(__components + "Databases/dbHelpers");

var studentProfile = require(__components + "StudentProfile/studentProfileDB");
var upcomingEvents = require(__components + "StudentProfile/upcomingEventsDB");
var studentSkill = require(__components + "StudentProfile/studentSkillDB");

module.exports = function (app, iosocket ) {


    /**
     * [focusOptions description]
     * @param  {[type]} assignmentData [description]
     * @return {[type]}                [description]
     */
    function getAssignments( assignmentData ) {
        var keys = ['assignmentId','assignmentName','courseId'];
        var assignments = _.map(assignmentData, obj =>_.pick(obj,keys) );
        assignments = _.uniqBy(assignments,'assignmentId');
        return assignments;
    }


    function collectDashboardData( req, res, callback ) {

        studentProfile.getStudentProfileAndClasses(req.user.id, function(err, studentData){

            if(studentData) {
                var studentProfile = _.pick(studentData[0],  ["id","name", "bio", "avatarFileName"]);
                var courses = _.map(studentData, obj => _.pick(obj,["id","code","courseName","description","disciplineType"]));
                // Retrieve the upcoming events.
                upcomingEvents.getStudentUpcomingEvents(req.user.id , function( errEvents, upcomingEventsData) {
                    var upEvents = _.map(upcomingEventsData, obj => _.pick(obj,['title','description','closedDate']));

                    studentSkill.getAssigmentAndTaskList(studentProfile.id, function(errTask, taskData) {
                        var assignmentTasks = _.map(taskData, obj => _.pick(obj, ['assignmentId','assignmentName','courseId','courseName','courseCode','taskName','taskId']));

                        //console.log("*************************** TasK Data\n\n", taskData);
                        //console.log("Assignment Data:\n", assignmentTasks);
                        //console.log("HERE",getAssignments(assignmentTasks));
                        var page = { "title":"Dashboard", "studentProfile":studentProfile, "courses": courses, "upcomingEvents": upEvents, 'assignments': getAssignments(assignmentTasks), 'assignmentTasks':assignmentTasks };

                        callback(req,res,page);
                    });
                });
            }
            else {
                res.status(500).end();
            }
        });
    }

    /**
     * Display data from the backend.
     * @param  {[type]} req  [description]
     * @param  {[type]} res  [description]
     * @param  {[type]} next )             {        collectDashboardData(req,res, function(req,res,data ) {            res.render( viewPath + "dashboard", { "title":"Dashboard", "studentProfile":studentProfile, "courses": courses, "upcomingEvents": upEvents, 'assignmentTasks': assignmentTasks });        });    } [description]
     * @return {[type]}      [description]
     */
    app.get('/dashboard', function( req, res, next ) {
        collectDashboardData(req,res, function(req,res,data ) {
            res.render( viewPath + "dashboard", data );
        });
    });

    /**
     * Dashboard data setups up the controller to have the same data as the backend expects.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   collectDashboardData(req,res, function(req,res,data) {            res.json(data);        });    } [description]
     * @return {[type]}      [description]
     */
    app.get('/dashboard/data', function(req,res) {
        collectDashboardData(req,res, function(req,res,data) {
            res.json(data);
        });
    });

}
