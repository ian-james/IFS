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

module.exports = function (app, iosocket) {

    function setupSessionFiles( req, organizedResults)
    {
        req.session.allFeedbackFile = organizedResults.allFeedbackFile;
        if( organizedResults.hasOwnProperty('feedbackFiles')) {

            for( var k in organizedResults['feedbackFiles'] ) {
                req.session[k] = organizedResults['feedbackFiles'][k];
            }
        }
    }

    app.post('/tool_upload', upload.any(), function(req,res,next) {

        console.log("***************************************");
        console.log(req.body);
        console.log(req.files);
         // Handle Zip files, text, docs and projects
        var uploadedFiles = Helpers.handleFileTypes( req, res );

        if( Errors.hasErr(uploadedFiles) )
        {
            var err = Errors.getErrMsg(uploadedFiles);
            //req.flash('errorMessage', err );
            res.status(500).send(JSON.stringify({"msg":err}));
            return;
        }

        var userSelection = req.body;
        userSelection['files'] = uploadedFiles;

        // Create Job Requests
        var tools = ToolManager.createJobRequests( req.session.toolFile, userSelection );
        var requestFile = Helpers.writeResults( tools, { 'filepath': uploadedFiles[0].filename, 'file': 'jobRequests.json'});
        req.session.jobRequestFile = requestFile;

        res.writeHead(202, { 'Content-Type': 'application/json' });

        // Add the jobs to the queue, results are return in object passed:[], failed:[]
        manager.makeJob(tools).then( function( jobResults ) {
            FeedbackFilterSystem.organizeResults( uploadedFiles, jobResults.result.passed, function(organized) {
                setupSessionFiles(req, organized);
                var data = { "msg":"Awesome"};
                res.write(JSON.stringify(data));
                res.end();
            });
        }, function(err){
            //TODO: Log failed attempt into a database and pass a flash message  (or more ) to tool indicate
            Logger.error("Failed to make jobs:", err );
            //req.flash('errorMessage', "There was an error processing your files." );
            res.status(400).send(JSON.stringify({"msg":err}));
        }, function(prog) {

            if(prog.tool == "Manager" && prog.msg == "Progress")
                iosocket.emit("ifsProgress", prog);
            Logger.log("Manager's progress is ", prog.progress, "%");
        })
        .catch( function(err){
            res.status(500).send({
                error: e
            });
        });

        manager.runJob();
    });
}