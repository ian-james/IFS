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

var studentModel = require(__components + "StudentModel/studentModelDB");
var socialModel = require(__components + "SocialModel/socialStatsDB");

var feedbackModel = require(__components + "InteractionEvents/feedbackEvents");




module.exports = function (app, iosocket )
{    /**
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

    function getSuggestion(items) {
        var sugKeys  = ['target','suggestions','value'];
        var suggestions = [];
        try {
            var stats = {};
            var suggestions =  _.map(items, function(obj) {
                var  t = _.pick(obj,sugKeys);
                var arr = JSON.parse( t.suggestions)
                t.suggestions = arr[0];
                return t;
            });
        }
        catch(e) {
        }
        return suggestions;
    }

    /**
     * This function retrieves writing stats from the database and prepares them for display on dashboard.
     *  Depending on the layout of the dashboard more stats can be retrieved via paralle method.
     * @param  {[type]}   req      [description]
     * @param  {[type]}   res      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function writingStats( req, res, callback ) {
       
        var toolSelect = req.session.toolSelect.toLowerCase();
        var topN = 3;
        async.parallel(
            [studentModel.getMyMostCommonSpellingMistakes.bind( null,req.user.id, topN ),
             studentModel.getMySpellingAccuracy.bind( null,req.user.id),
             socialModel.getMostCommonSpellingMistakes.bind( null, topN ),
             socialModel.getSpellingAccuracy,
             studentModel.getMyMostUsedTools.bind( null,req.user.id, toolSelect, topN ),
             socialModel.getMostUsedTools.bind( null, toolSelect, topN )
            ],
            function(err,results) {

                // Match the length of parallel input.
                if(results && results.length == 6 ) {
                    var sugKeys  = ['target','suggestions','value'];
                    var stats = {};
                    var suggestions = getSuggestion(results[0]);
                    var accuracy = results[1];

                    var utools = results[4];
                    var stools = results[5];

                    stats['userStats'] = {
                        'suggestions': suggestions,
                        'accuracy': accuracy,
                        'tools': utools
                    };

                    suggestions =  getSuggestion(results[2]);
                    var accuracy = results[3];
                    stats['socialStats'] = {
                        'suggestions': suggestions,
                        'accuracy': accuracy,
                        'tools': stools
                    };
                    callback(stats);
                }
                else
                    callback([]);
            }
        );
    }

     function programmingStats( req, res, callback ) {

        var toolSelect = req.session.toolSelect.toLowerCase();
        var topN = 1;
        var id = req.user.id;

        var tasks = [
            studentModel.getMyMostUsedTools.bind( null, id, toolSelect, topN ),
            studentModel.getMyCommonFeedbackTool.bind(null, id, toolSelect, topN),
            studentModel.getMyCommonViewedMoreFeedbackTool.bind(null,id, toolSelect, topN ),

            socialModel.getMostUsedTools.bind( null, toolSelect, topN ),
            socialModel.getCommonFeedbackTool.bind(null,toolSelect, topN),
            socialModel.getCommonViewedMoreFeedbackTool.bind(null, toolSelect, topN),

            studentModel.getMyMostCommonFeedback.bind(null,id, toolSelect, 3),
            studentModel.getSubmissionToErrorRate.bind(null,id, toolSelect),
            socialModel.getOtherSubmissionToErrorRate.bind(null, id, toolSelect)
        ];

        async.parallel( tasks,
            function(err,results) {
                
                // Match the length of parallel input.
                if(results && results.length == tasks.length ) {
                    var stats = {};
                    var commonFeedback = results[6];
                    var submissionError = results[7][0];

                    stats['userStats'] = {
                        'mostUsedTools': results[0][0],
                        'mostFeedbackTool': results[1][0],
                        'mostViewedMoreFeedbackTool': results[2][0],
                        'commonFeedback': commonFeedback,
                        'submissionErrorRate': submissionError
                    };

                    stats['socialStats'] = {
                        'mostUsedTools': results[3][0],
                        'mostFeedbackTool': results[4][0],
                        'mostViewedMoreFeedbackTool': results[5][0],
                        'submissionErrorRate': results[8][0]
                    };
                    callback(stats);
                }
                else
                    callback([]);

            }
        );
    }

    function collectDashboardData( req, res, callback ) {

        studentProfile.getStudentProfileAndClasses(req.user.id, function(err, studentData) {
            if(studentData) {
                var studentProfile = _.pick(studentData[0],  ["id","name", "bio", "avatarFileName"]);
                var courses = _.map(studentData, obj => _.pick(obj,["id","code","courseName","description","disciplineType"]));

                // Retrieve the upcoming events.
                upcomingEvents.getStudentUpcomingEvents(req.user.id , function( errEvents, upcomingEventsData) {
                    var upEvents = _.map(upcomingEventsData, obj => _.pick(obj,['title','description','closedDate']));

                    studentSkill.getAssigmentAndTaskList(studentProfile.id, function(errTask, taskData) {

                        var assignmentTasks = _.map(taskData, obj => _.pick(obj, ['assignmentId','assignmentName','courseId','courseName','courseCode','taskName','taskId']));

                        studentSkill.getUserSkills( req.user.id, function(skillErr, skills) {
                            var page = { "title":"Dashboard", "studentProfile":studentProfile, "courses": courses, "upcomingEvents": upEvents, 
                                'assignments': getAssignments(assignmentTasks), 'assignmentTasks':assignmentTasks, 'skills': skills };

                            if( req.session.toolSelect == "Programming" ) {
                                programmingStats(req,res,function(stats) {
                                    page['stats'] =  stats;
                                    page['toolType']  = "programming";
                                    callback(req,res,page);
                                });
                            }
                            else {
                                writingStats(req,res,function(stats) {
                                    page['stats'] =  stats;
                                    page['toolType']  = "writing";
                                    callback(req,res,page);
                                });
                            }
                        });
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
     * @param  {[type]} next )
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
     * @param  {[type]} res) 
     * @return {[type]}      [description]
     */
    app.get('/dashboard/data', function(req,res) {
        collectDashboardData(req,res, function(req,res,data) {
            res.json(data);
        });
    });
}
