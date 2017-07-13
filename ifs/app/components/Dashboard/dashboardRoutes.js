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
        var keys = ['assignmentId','assignmentName','courseId','description'];
        var assignments = _.map(assignmentData, obj =>_.pick(obj,keys) );
        assignments = _.uniqBy(assignments,'assignmentId');
        return assignments;
    }

    /**
     * Get suggestion object from required keys.
     * @param  {[type]} items [description]
     * @return {[type]}       [description]
     */
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
     * Retrieves several statics at a time in parallel and organizes them for display.
     * @param  {[type]}   statsReq [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function genericStatsRequest( statsReq, callback ) {

        var calls = _.map(statsReq,'request');
        async.parallel( calls, function(err,results) {

            // Match the length of parallel input.
            if(results && results.length == calls.length ) {

                var ret = {};
                for( var i = 0; i < calls.length; i++ ){
                    var r = results[i];
                    if(statsReq[i]['process'])
                        r = statsReq[i].process( r );

                    if(statsReq[i].resultPath)
                        _.set(ret, statsReq[i].resultPath, r);
                }
                callback(ret);
            }
            else
                callback([]);
        });
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
        var requests = [
            {
                'request': studentModel.getMyMostCommonSpellingMistakes.bind( null,req.user.id, topN ),
                'process': getSuggestion,
                'resultPath': 'userStats.suggestions'
            },
            {
                'request': studentModel.getMySpellingAccuracy.bind( null,req.user.id),
                'process': null,
                'resultPath': 'userStats.accuracy'
            },
            {
                'request': socialModel.getMostCommonSpellingMistakes.bind( null, topN ),
                'process': getSuggestion,
                'resultPath': 'socialStats.suggestions'
            },
            {
                'request': socialModel.getSpellingAccuracy,
                'process': null,
                'resultPath': 'socialStats.accuracy'
            },

            {
                'request': studentModel.getMyMostUsedTools.bind( null,req.user.id, toolSelect, topN ),
                'process': null,
                'resultPath': 'userStats.tools'
            },
            {
                'request': socialModel.getMostUsedTools.bind( null, toolSelect, topN ),
                'process': null,
                'resultPath': 'socialStats.tools'
            }
        ];
        genericStatsRequest(requests,callback);
    }

    /**
     * Minimal function to process double wrapped arrays into single
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    function farr( arr ) {
        return arr && arr.length > 0 ? arr[0] : arr;
    }

    /**
     * Setup Programming dashboard stats
     * @param  {[type]}   req      [description]
     * @param  {[type]}   res      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function programmingStats( req, res, callback ) {

        var toolSelect = req.session.toolSelect.toLowerCase();
        var topN = 1;
        var id = req.user.id;

        var requests = [
            {
                'request': studentModel.getMyMostUsedTools.bind( null, id, toolSelect, topN ),
                'process': farr,
                'resultPath': 'userStats.mostUsedTools'
            },
            {
                'request': studentModel.getMyCommonFeedbackTool.bind(null, id, toolSelect, topN),
                'process': null,
                'resultPath': 'userStats.mostFeedbackTools'
            },
            {
                'request': studentModel.getMyCommonViewedMoreFeedbackTool.bind(null,id, toolSelect, topN ),
                'process': farr,
                'resultPath': 'userStats.mostViewedMoreFeedbackTool'
            },
            {
                'request': socialModel.getMostUsedTools.bind( null, toolSelect, topN ),
                'process': farr,
                'resultPath': 'socialStats.mostUsedTools'
            },
            {
                'request': socialModel.getCommonFeedbackTool.bind(null,toolSelect, topN),
                'process': null,
                'resultPath': 'socialStats.mostFeedbackTools'
            },
            {
                'request': socialModel.getCommonViewedMoreFeedbackTool.bind(null, toolSelect, topN),
                'process': farr,
                'resultPath': 'socialStats.mostViewedMoreFeedbackTool'
            },

            {
                'request': studentModel.getMyMostCommonFeedback.bind(null,id, toolSelect, 3),
                'process': null,
                'resultPath': 'userStats.commonFeedback'
            },
            {
                'request': studentModel.getSubmissionToErrorRate.bind(null,id, toolSelect),
                'process': farr,
                'resultPath': 'userStats.submissionErrorRate'
            },
            {
                'request': socialModel.getOtherSubmissionToErrorRate.bind(null, id, toolSelect),
                'process': farr,
                'resultPath': 'socialStats.submissionErrorRate'
            }
        ];
        genericStatsRequest(requests,callback);
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

                        var assignmentTasks = taskData;

                        studentSkill.getUserSkills( req.user.id, function(skillErr, skills) {

                            var focus = null;
                            if( req.session.dailyFocus )
                                focus = req.session.dailyFocus;

                            var page = { "title":"Dashboard", "studentProfile":studentProfile, "courses": courses, "upcomingEvents": upEvents,
                                'assignments': getAssignments(assignmentTasks), 'assignmentTasks':assignmentTasks, 'skills': skills, 'focus': focus };

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
    })
;
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

    /**
     * Post request from client-angular not a real form. Sending us select info on course/assignment focus data.
     * @param  {[type]} req    [description]
     * @param  {Object} res){                     req.session.dailyFocus [description]
     * @return {[type]}        [description]
     */
    app.post('/dashboard/assignmentFocusData', function(req,res){
        req.session.dailyFocus = {
            courseId: req.body.focusCourseId,
            assignmentId: req.body.focusAssignmentId
        };
        req.session.save();
    });
}
