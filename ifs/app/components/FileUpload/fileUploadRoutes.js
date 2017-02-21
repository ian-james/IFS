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

        // Get files names to be inserted
        var uploadedFiles = Helpers.getFileNames( req.files );

        // Handle Zip files, text, docs and projects
        uploadedFiles = Helpers.handleFileTypes( uploadedFiles );
        if( 'err' in uploadedFiles )
        {
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

        // Add the jobs to the queue and
        manager.makeJob(tools).then( function( r ) {
            var res =  manager.combineResults(r );
            return FeedbackFilterSystem.organizeResults( uploadedFiles, res );
        })
        .then( function(result) {
            req.session.feedbackFiles = result.feedbackFiles;
            rawFeedbackDB.addRawFeedbackToDB(req,res,requestFile, result );
        })
        .catch( function(err){
            res.status(500, {
                error: e
            });
        });

        manager.runJob();
    });
}
