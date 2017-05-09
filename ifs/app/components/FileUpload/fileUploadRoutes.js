var router = require('express').Router();
var _ = require('lodash');

// Path and file management
var path = require('path');

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

var Errors = require(__components + "Errors/errors");

var event = require(__components + "InteractionEvents/Event.js" );

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
            event.trackEvent( iosocket, event.submissionEvent(req.user.id ,"info", { "displayName": job.displayName, "runCmd": job.runCmd }));
        });

    }

    function emitJobOptions( req, iosocket, formData ) {
        var options =  _.pickBy(formData, function(value,key){
            return !(_.startsWith(key,'tool-') /*|| _.startsWith(key,'enabled-')*/)
        });

        event.trackEvent( iosocket, event.submissionEvent(req.user.id, "info-options", options));
    }

    /**
     * Emits very basic information about the raw data (tool, type )
     * @param  {[type]} req           [description]
     * @param  {[type]} iosocket      [description]
     * @param  {[type]} feedbackItems [description]
     * @return {[type]}               [description]
     */
    function emitFeedbackResults( req, iosocket, feedbackItems ){
        _.forEach(feedbackItems, function(fi ){
            event.trackEvent( iosocket, event.submissionEvent(req.user.id ,"feedback", {
                "displayName": fi.displayName,
                "type": fi.type ,
                "runType": fi.runType
            }));
        });
    }

    app.post('/tool_upload', upload.any(), function(req,res,next) {

        event.trackEvent( iosocket, event.submissionEvent(req.user.id, "received", req.body) );

        emitJobOptions( req, iosocket, req.body);

        var uploadedFiles = Helpers.handleFileTypes( req, res );

        if( Errors.hasErr(uploadedFiles) )
        {
            var err = Errors.getErrMsg(uploadedFiles);
            event.trackEvent( iosocket, event.submissionEvent(req.user.id,"failed", err) ) ;
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
            event.trackEvent( iosocket, event.submissionEvent(req.user.id, "failed", err) );
            res.status(500).send(JSON.stringify({"msg":"Please select a tool to evaluate your work."}));
            return;
        }
        var requestFile = Helpers.writeResults( tools, { 'filepath': uploadedFiles[0].filename, 'file': 'jobRequests.json'});
        req.session.jobRequestFile = requestFile;

        emitJobRequests(req,iosocket,tools);

        res.writeHead(202, { 'Content-Type': 'application/json' });

        // Add the jobs to the queue, results are return in object passed:[], failed:[]
        manager.makeJob(tools).then( function( jobResults ) {

            emitFeedbackResults(req, iosocket, jobResults.result.passed);

            FeedbackFilterSystem.organizeResults( uploadedFiles, jobResults.result.passed, function(organized) {
                setupSessionFiles(req, organized);
                event.trackEvent( iosocket, event.submissionEvent(req.user.id, "success", {}) );
                var data = { "msg":"Awesome"};
                res.write(JSON.stringify(data));
                res.end();
            });
        }, function(err){
            //TODO: Log failed attempt into a database and pass a flash message  (or more ) to tool indicate
            Logger.error("Failed to make jobs:", err );
            event.trackEvent( iosocket, event.submissionEvent(req.user.id, "toolError", {"msg":e}) );
            //req.flash('errorMessage', "There was an error processing your files." );
            res.status(400).send(JSON.stringify({"msg":err}));
        }, function(prog) {

            if(prog.tool == "Manager" && prog.msg == "Progress")
                iosocket.emit("ifsProgress", prog);
            Logger.log("Manager's progress is ", prog.progress, "%");
        })
        .catch( function(err){
            event.trackEvent( iosocket, event.submissionEvent(req.user.id, "toolError", {"msg":e}) );
            res.status(500).send({
                error: e
            });
        });

        manager.runJob();
    });
}