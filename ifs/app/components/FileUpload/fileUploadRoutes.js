var router = require('express').Router();
var _ = require('lodash');

// Path and file management
var path = require('path');
var async = require('async');

// Managers
var manager = require( __components + 'Queue/managerJob');
var ToolManager = require( __components + '/Tool/buildTool');
var Logger = require( __configs + "loggingConfig");

// Database
var rawFeedbackDB = require(__components  + 'Feedback/feedbackDatabase.js');

// File Upload
var Helpers = require("./fileUploadHelpers");
var upload = require("./fileUploadConfig").upload;

// Feedback
var FeedbackFilterSystem = require(__components + 'FeedbackFiltering/feedbackFilterSystem');

var config = require(__configs + 'databaseConfig');
var db = require( __configs + 'database');
var dbHelpers = require(__components + "Databases/dbHelpers");
var Errors = require(__components + "Errors/errors");
var eventDB = require(__components + "InteractionEvents/buildEvent.js" );
var event = require(__components + "InteractionEvents/event.js" );
var submissionEvent = require(__components + "InteractionEvents/submissionEvents.js");
var tracker = require(__components + "InteractionEvents/trackEvents.js" );

module.exports = function (app, iosocket) {

    /**
     * Stores feedback file names in session variables based on type.
     * @param  {[type]} req              [description]
     * @param  {[type]} organizedResults [description]
     * @return {[type]}                  [description]
     */
    function setupSessionFiles( req, organizedResults)
    {
        req.session.allFeedbackFile = organizedResults.allFeedbackFile;
        if( organizedResults.hasOwnProperty('feedbackFiles')) {

            for( var k in organizedResults['feedbackFiles'] ) {
                req.session[k] = organizedResults['feedbackFiles'][k];
            }
        }
    }

    /**
     * Emit an event for each job that will run indicate the tool and run command basic information.
     * @param  {[type]} req         [description]
     * @param  {[type]} iosocket    [description]
     * @param  {[type]} jobRequests [description]
     * @return {[type]}             [description]
     */
    function emitJobRequests( req, iosocket, jobRequests ) {
        _.forEach(jobRequests, function(job){
            tracker.trackEvent( iosocket, eventDB.submissionEvent(req.user.sessionId, req.user.id ,"info", { "displayName": job.displayName, "runCmd": job.runCmd }));
        });

    }

    /**
     * Emit the options associated with job requests.
     * @param  {[type]} req      [description]
     * @param  {[type]} iosocket [description]
     * @param  {[type]} formData [description]
     * @return {[type]}          [description]
     */
    function emitJobOptions( req, iosocket, formData ) {
        var options =  _.pickBy(formData, function(value,key){
            return !(_.startsWith(key,'tool-') /*|| _.startsWith(key,'enabled-')*/)
        });

        tracker.trackEvent( iosocket, eventDB.submissionEvent(req.user.sessionId, req.user.id, "info-options", options));
    }

    /**
     * Emits very basic information about the raw data (tool, type )
     * @param  {[type]} req           [description]
     * @param  {[type]} iosocket      [description]
     * @param  {[type]} feedbackItems [description]
     * @return {[type]}               [description]
     */
    function emitFeedbackResults( req, iosocket, submissionId, feedbackItems ){

        async.each(feedbackItems, function( fi, callback ) {
            var fe =  eventDB.makeFeedbackEvent( req.user.sessionId, req.user.id, submissionId, fi );

            dbHelpers.insertEventC( config.feedback_table, fe, function(err,d){
                // Empty Callback if feedback fails to save, we aren't too concerned.
                callback();
            });

        }, function(err){
            if(err)
                Logger.error(err);
            else
                Logger.log("Finished writing feedback to DB.");
        });
    }

    app.post('/tool_upload', upload.any(), function(req,res,next) {

        submissionEvent.addSubmission( eventDB.eventID(req), function(subErr, succSubmission) {

            var submissionRequest = submissionEvent.getSubmissionNumber(req.user.id);
            db.query(submissionRequest.request,submissionRequest.data, function(err,submissionIdRes){

                var submissionId = event.returnData( submissionIdRes[0] );

                emitJobOptions( req, iosocket, req.body);

                var uploadedFiles = Helpers.handleFileTypes( req, res );

                if( Errors.hasErr(uploadedFiles) )
                {
                    var err = Errors.getErrMsg(uploadedFiles);
                    tracker.trackEvent( iosocket, eventDB.submissionEvent(req.user.sessionId, req.user.id,"failed", err) ) ;
                    //req.flash('errorMessage', err );
                    res.status(500).send(JSON.stringify({"msg":err}));
                    return;
                }

                var userSelection = req.body;
                userSelection['files'] = uploadedFiles;

                // Create Job Requests
                var tools = ToolManager.createJobRequests( req.session.toolFile, userSelection );
                if(!tools || tools.length == 0)
                {
                    var err = Errors.cErr();
                    tracker.trackEvent( iosocket, eventDB.submissionEvent(req.user.sessionId, req.user.id, "failed", err) );
                    res.status(500).send(JSON.stringify({"msg":"Please select a tool to evaluate your work."}));
                    return;
                }

                //Upload files names and job requests
                var requestFile = Helpers.writeResults( tools, { 'filepath': uploadedFiles[0].filename, 'file': 'jobRequests.json'});
                var filesFile = Helpers.writeResults( uploadedFiles, { 'filepath': uploadedFiles[0].filename, 'file': 'fileUploads.json'});
                req.session.jobRequestFile = requestFile;
                req.session.uploadFilesFile = filesFile;

                emitJobRequests(req,iosocket,tools);

                res.writeHead(202, { 'Content-Type': 'application/json' });

                // Add the jobs to the queue, results are return in object passed:[], failed:[]
                manager.makeJob(tools).then( function( jobResults ) {

                    emitFeedbackResults(req, iosocket, submissionId, jobResults.result.passed);

                    FeedbackFilterSystem.organizeResults( uploadedFiles, jobResults.result.passed, function(organized) {
                        setupSessionFiles(req, organized);
                        tracker.trackEvent( iosocket, eventDB.submissionEvent(req.user.sessionId, req.user.id, "success", {}) );
                        var data = { "msg":"Awesome"};
                        res.write(JSON.stringify(data));
                        res.end();
                    });
                }, function(err){
                    //TODO: Log failed attempt into a database and pass a flash message  (or more ) to tool indicate
                    Logger.error("Failed to make jobs:", err );
                    tracker.trackEvent( iosocket, eventDB.submissionEvent(req.user.sessionId, req.user.id, "toolError", {"msg":e}) );
                    //req.flash('errorMessage', "There was an error processing your files." );
                    res.status(400).send(JSON.stringify({"msg":err}));
                }, function(prog) {

                    if(prog.tool == "Manager" && prog.msg == "Progress")
                        iosocket.emit("ifsProgress", prog);
                    Logger.log("Manager's progress is ", prog.progress, "%");
                })
                .catch( function(err){
                    tracker.trackEvent( iosocket, eventDB.submissionEvent(req.user.sessionId, req.user.id, "toolError", {"msg":e}) );
                    res.status(500).send({
                        error: e
                    });
                });

                manager.runJob();
            });
        });
    })
}