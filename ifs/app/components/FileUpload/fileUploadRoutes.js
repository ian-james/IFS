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


module.exports = function (app) {

    app.post('/tool_upload', upload.any(), function(req,res,next) {

        console.log("STARTING HERE");
        console.log("Upload", upload);
        console.log("********************************************************************** ");
        console.log("Files ", req.files );
        console.log("********************************************************************** ");

        // Get files names to be inserted
        var uploadedFiles = Helpers.getFileNames( req.files );

        // Handle Zip files, text, docs and projects
        uploadedFiles = Helpers.handleFileTypes( uploadedFiles );
        if( 'err' in uploadedFiles )
        {
            console.log("Found an error");
            req.flash('errorMessage', uploadedFiles.err.msg );
            res.redirect('/tool');
            return;
        }

        var userSelection = req.body;
        userSelection['files'] = uploadedFiles;
        
        // Create Job Requests
        var tools = ToolManager.createJobRequests( userSelection );
        var requestFile = Helpers.writeResults( tools, { 'filepath': uploadedFiles[0].filename, 'file': 'jobRequests.json'});
        req.session.jobRequestFile = requestFile;

        // Add the jobs to the queue, results are return in object passed:[], failed:[]
        manager.makeJob(tools).then( function( jobResults ) {
            var organizedResults = FeedbackFilterSystem.organizeResults( uploadedFiles, jobResults.result.passed );
            req.session.allFeedbackFile = organizedResults.allFeedbackFile;
            
            //TODO: Uncomment this when we actually organize database scheme.
            //rawFeedbackDB.addRawFeedbackToDB(req,res,requestFile, result );
            if( organizedResults.feedback.writing ) {
                console.log("Try feedback");
                res.redirect('/feedback');
            }
            else if( organizedResults.feedback.visual ) {
                // For now, we redirect directly to cloud.
                res.redirect('/cloud');
            }
            else {
                console.log("No feedback file writing or visual");
                res.redirect('/tool');
            }
        }, function(err){
            //TODO: Log failed attempt into a database and pass a flash message  (or more ) to tool indicate
            Logger.error("Failed to make jobs:", err );
            res.redirect('/tool');
        })
        .catch( function(err){
            res.status(500, {
                error: e
            });
        });

        manager.runJob();
    });
}