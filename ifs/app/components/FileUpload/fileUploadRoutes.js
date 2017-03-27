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

module.exports = function (app) {

    function setupSessionFiles( req,  organizedResults)
    {
        req.session.allFeedbackFile = organizedResults.allFeedbackFile;
        if( organizedResults.hasOwnProperty('feedbackFiles')) {

            for( var k in organizedResults['feedbackFiles'] ) {
                req.session[k] = organizedResults['feedbackFiles'][k];
            }
        }
    }

    app.post('/tool_upload', upload.any(), function(req,res,next) {

         // Handle Zip files, text, docs and projects
        var uploadedFiles = Helpers.handleFileTypes( req, res );

        if( Errors.hasErr(uploadedFiles) )
        {
            req.flash('errorMessage', Errors.getErrMsg(uploadedFiles) );
            res.redirect('/tool');
            return;
        }

        var userSelection = req.body;
        userSelection['files'] = uploadedFiles;

        // Create Job Requests
        var tools = ToolManager.createJobRequests( req.session.toolFile, userSelection );
        var requestFile = Helpers.writeResults( tools, { 'filepath': uploadedFiles[0].filename, 'file': 'jobRequests.json'});
        req.session.jobRequestFile = requestFile;

        // Add the jobs to the queue, results are return in object passed:[], failed:[]
        manager.makeJob(tools).then( function( jobResults ) {
            var organizedResults = FeedbackFilterSystem.organizeResults( uploadedFiles, jobResults.result.passed );
            setupSessionFiles(req, organizedResults);

            if( organizedResults.feedback.writing ||  organizedResults.feedback.programming ) {
                res.redirect('/feedback');
            }
            else if( organizedResults.feedback.visual ) {
                // For now, we redirect directly to cloud.
                res.redirect('/cloud');
            }
            else {
                req.flash('errorMessage', "Unsure what results where provided." );
                res.redirect('/tool');
            }
        }, function(err){
            //TODO: Log failed attempt into a database and pass a flash message  (or more ) to tool indicate
            Logger.error("Failed to make jobs:", err );
            res.redirect('/tool');
        }, function(prog) {
            console.log("Manager's progress is ", prog.progress, "%");
        })
        .catch( function(err){
            res.status(500, {
                error: e
            });
        });

        manager.runJob();
    });
}