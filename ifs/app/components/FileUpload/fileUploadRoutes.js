var router = require('express').Router();
var _ = require('lodash');

// Path and file management
var path = require('path');
var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');

// Managers
var manager = require( __components + 'Queue/managerJob');
var ToolManager = require( __components + '/Tool/buildTool');
var Logger = require( __configs + "loggingConfig");

// File Upload
var Helpers = require("./fileUploadHelpers");
var upload = require("./fileUploadConfig").upload;

// Feedback
//var FeedbackFilterSystem = require(__components + 'FeedbackFiltering/feedbackFilterSystem');

var dbcfg = require(__configs + 'databaseConfig');
var db = require( __configs + 'database');
var dbHelpers = require(__components + "Databases/dbHelpers");
var Errors = require(__components + "Errors/errors");
var eventDB = require(__components + "InteractionEvents/buildEvent.js" );
var event = require(__components + "InteractionEvents/event.js" );
var submissionEvent = require(__components + "InteractionEvents/submissionEvents.js");
var tracker = require(__components + "InteractionEvents/trackEvents.js" );

var preferencesDB = require( __components + 'Preferences/preferenceDB.js');

var {Feedback} = require("../../models/feedback");
var {Assignment} = require("../../models/assignment");

module.exports = function (app, iosocket) {

    /**
     * Emit an event for each job that will run indicate the tool and run command basic information.
     * @param  {[type]} req         [description]
     * @param  {[type]} iosocket    [description]
     * @param  {[type]} jobRequests [description]
     * @return {[type]}             [description]
     */
    function emitJobRequests( req, iosocket, jobRequests ) {
        _.forEach(jobRequests, function(job) {
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
     * Simplifying all the callbacks for writing feedback files to DB.
     * @param  {[type]}   sessionId       [description]
     * @param  {[type]}   userId          [description]
     * @param  {[type]}   submissionId    [description]
     * @param  {[type]}   feedbackFileObj [description]
     * @param  {Function} callback        [description]
     * @return {[type]}                   [description]
     */
    function writeFeedbackFile( sessionId, userId, submissionId, feedbackFileObj, assignmentID, callback ) {
        fs.readFile( feedbackFileObj.file, function(err,data){
            if(data) {

                var feedbackItemData = JSON.parse(data);
                var feedbackItems = feedbackItemData['feedback'];
                var feedbackStatsItems = feedbackItemData['feedbackStats'];

                // Feedback Items in Feedback Deb
                async.each(feedbackItems, function( fi, _callback ) {

                    // Add displayName and runType before inserting into DB
                    var toolAdd = {"displayName": feedbackFileObj.displayName, "runType": feedbackFileObj.runType };
                    _.extend(fi,toolAdd);

                    var fe =  eventDB.makeFeedbackEvent( sessionId, userId, submissionId, fi , assignmentID);

                    dbHelpers.insertEventC( dbcfg.feedback_table, fe, function(err,d){
                        // Empty Callback if feedback fails to save, we aren't too concerned.
                        _callback();
                    });

                }, function(err){
                    if(err)
                        Logger.error(err);
                    else
                        Logger.log("Finished writing feedback to DB.");

                    callback();
                });
            }
            else
                callback("Failed to read feedback file:" + feedbackFileObj.file );
        });
    }

    function writeFeedbackStatsFile( sessionId, userId, submissionId, feedbackFileObj, callback ) {
        fs.readFile( feedbackFileObj.file, function(err,data){
            if(data) {
                var feedbackItemData = JSON.parse(data);
                var feedbackStatsItems = feedbackItemData['feedbackStats'];

                async.each(feedbackStatsItems, function( fi, _callback ) {

                    // Add displayName and runType before inserting into DB
                    var toolAdd = {"displayName": feedbackFileObj.displayName, "runType": feedbackFileObj.runType };
                    _.extend(fi,toolAdd);

                    var fs =  eventDB.makeFeedbackStatsEvent( sessionId, userId, submissionId, fi );

                    dbHelpers.insertEventC( dbcfg.feedback_stats_table, fs, function(err,d){
                        // Empty Callback if feedback fails to save, we aren't too concerned.
                        _callback();
                    });

                }, function(err){
                    if(err)
                        Logger.error(err);
                    else
                        Logger.log("Finished writing feedback to DB.");

                    callback();
                });
            }
            else
                callback("Failed to read stats file:" + feedbackFileObj.file );
        });
    }


    /**
     * Emits very basic information about the raw data (tool, type )
     * @param  {[type]} req           [description]
     * @param  {[type]} iosocket      [description]
     * @param  {[type]} feedbackItems [description]
     * @return {[type]}               [description]
     */
    function emitFeedbackResults( sessionId, userId, submissionId, feedbackItemFiles, assignmentID ){

        async.each(feedbackItemFiles, function( feedbackFile, callback) {
            writeFeedbackFile(sessionId, userId, submissionId,feedbackFile, assignmentID, callback );
        }, function(err) {
            if(err)
                Logger.error(err);
            else
                Logger.log("Finished writing  all feedback to DB.");
        });

        async.each(feedbackItemFiles, function( feedbackFile, callback) {
            writeFeedbackStatsFile(sessionId, userId, submissionId,feedbackFile, callback );
        }, function(err) {
            if(err)
                Logger.error(err);
            else
                Logger.log("Finished writing  all feedback to DB.");
        });
    }

    /**
     * Preferences are saved
     * @param  {[type]} req [description]
     * @return {[type]}     [description]
     */
    function saveToolSelectionPreferences( userId, toolType, formData ) {

        var preferences =  _.pickBy(formData, function(value,key){
            return (_.startsWith(key,'opt-') || _.startsWith(key,'enabled-'))
        });

        preferencesDB.clearStudentFormPreferences(userId,toolType, function( err, clearResult ) {

            async.eachOfSeries(preferences, function( value,key, callback ) {
                preferencesDB.setStudentPreferences(userId, toolType,  key, value, callback);
            }, function(err){
                if(err)
                    Logger.error(err);
                else
                    Logger.log("Finished writing feedback to DB.");
            });
        });
    }

    function saveUploadErrorFiles( userId, submissionId, fileDir, callback ) {
        var dest = "./users/failedUploads/"
        var submissionFolder = path.join( dest,userId.toString(), submissionId.toString() );

        fse.ensureDir(submissionFolder, function(err) {
            if(err) {
                Logger.error("Unable to save uploaded files for submission error.");
            }
            else {
                Logger.info("Upload Error Folder Structure for ", submissionFolder, " has been created");
                fse.copy( fileDir, submissionFolder, err => {
                    Logger.error('Failed to upload files. Saving uploaded files failed');
                });
            }
        });
    }

    app.post('/assignment', async function(req, res) {
        var temp = req.body.course;
        var fin = 0;

        if(temp == "None" || temp == "")
        {
            res.send({'assignment': fin});
        }
        else
        {
            //find assignment with name in assignment table
            var assignment = await Assignment.query()
            .where("name", "=", temp)
            .catch(function(err) {
                res.send({
                    'value': assignment
                });
                console.log(err.stack);
                return;
            });

            //get the assignment id
            fin = assignment[0].id;

            res.send({'assignment': fin});
        }

    });

    app.post('/tool_upload', upload.any(), function(req,res,next) {
        var assignmentID = req.body.assignId;

        // saves the tools that were selected
        var user = eventDB.eventID(req);
        saveToolSelectionPreferences(req.user.id, req.session.toolSelect, req.body);

        submissionEvent.addSubmission( user, function(subErr, succSubmission) {

            //obtain last submission from the requesting user
            var submissionRequest = submissionEvent.getLastSubmissionId(user.userId, user.sessoinId);

            db.query(submissionRequest.request,submissionRequest.data, function(err,submissionIdRes){

                // get submission ID
                var submissionId = event.returnData( submissionIdRes[0] );


                //submit all tools and options to user_interactions database
                emitJobOptions( req, iosocket, req.body);

                //deal with uploaded files
                var uploadedFiles = Helpers.handleFileTypes( req, res );

                if( Errors.hasErr(uploadedFiles) ) {
                    var err = Errors.getErrMsg(uploadedFiles);
                    tracker.trackEvent( iosocket, eventDB.submissionEvent(user.sessionId, user.userId,"failed", err) ) ;

                    if( req.files && uploadedFiles && uploadedFiles.length > 0 )
                    {
                        saveUploadErrorFiles( req.user.id, user.sessionId, uploadedFiles[0].destination, function(d,e) {
                            Logger.log("Saving failed upload files for user:", req.user.id);
                        });
                    }
                    //req.flash('errorMessage', err );
                    res.status(500).send(JSON.stringify({"msg":"fails at uploadFiles"}));
                    return;
                }


                //get the tool selection and add target files
                var userSelection = req.body;
                userSelection['files'] = uploadedFiles;

                // Create Job Requests
                var tools = ToolManager.createJobRequests( req.session.toolFile, userSelection );
                if(!tools || tools.length == 0)
                {
                    var err = Errors.cErr();
                    saveUploadErrorFiles( req.user.id, user.sessionId, uploadedFiles[0].destination, function(d,e) {
                        Logger.log("Saving failed job request files for user:", req.user.id);
                    });
                    tracker.trackEvent( iosocket, eventDB.submissionEvent(user.sessionId, user.userId, "failed", err) );
                    res.status(500).send(JSON.stringify({"msg":"Please select a tool to evaluate your work."}));
                    return;
                }

                //Upload files names and job requests, jobRequests remains to ease testing and debugging.
                var requestFile = Helpers.writeResults( tools, { 'filepath': uploadedFiles[0].filename, 'file': 'jobRequests.json'});
                var filesFile = Helpers.writeResults( uploadedFiles, { 'filepath': uploadedFiles[0].filename, 'file': 'fileUploads.json'});
                req.session.jobRequestFile = requestFile;
                req.session.uploadFilesFile = filesFile;

                //store tool used and command run into user_interaction table
                emitJobRequests(req,iosocket,tools);

                res.writeHead(202, { 'Content-Type': 'application/json' });


                // Add the jobs to the queue, results are return in object passed:[], failed:[]
                manager.makeJob(tools).then( function( jobResults ) {
                    tracker.trackEvent( iosocket, eventDB.submissionEvent(user.sessionId, user.userId, "success", {}) );
                    emitFeedbackResults(user.sessionId, user.userId, submissionId, jobResults.result.passed, assignmentID);
                    var data = { "msg":"Awesome"};
                    res.write(JSON.stringify(data));
                    res.end();

                }, function(err){
                    Logger.error("Failed to make jobs:", err );
                    // NOTE: Abusing XHR communication because I can't get the below code to communicate.
                    // Want to just sent error to XHR but nothing gets communicated. So added 'err':true
                    // res.status(500).send(data)
                    var data = { "err": true, "msg":"Assessment tools did not succesfully complete, no feedback available."};
                    res.write(JSON.stringify(data));
                    res.end();

                }, function(prog) {
                    if(prog.tool == "Manager" && prog.msg == "Progress")
                        iosocket.emit("ifsProgress", prog);
                    Logger.log("Manager's progress is ", prog.progress, "%");
                })
                .catch( function(err){

                    tracker.trackEvent( iosocket, eventDB.submissionEvent(user.sessionId, user.userId, "toolError", {"msg":e}) );
                    saveUploadErrorFiles( req.user.id, user.sessionId, uploadedFiles[0].destination, function(d,e) {
                        Logger.log("Saving Tool Error upload files for user:", req.user.id);
                    });
                    res.status(500).send({
                        error: err
                    });
                });


                manager.runJob();

            });
        });
    })
}