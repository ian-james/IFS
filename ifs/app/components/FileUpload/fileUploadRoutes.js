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

        console.log(req.files);
        console.log('*break;');
        console.log(uploadedFiles);

        // Handle Zip files, text, docs and projects
        Helpers.handleZipFile( uploadedFiles[0].filename );
        Helpers.handleDocxFile( uploadedFiles[0].filename );

        var userSelection = req.body;
        userSelection['files'] = uploadedFiles;
        
        var tools = ToolManager.createJobRequests( userSelection );

        console.log("Tools are ", tools);

        manager.makeJob(tools).then( function( r ) {
            var res =  manager.combineResults(r );
            return FeedbackFilterSystem.organizeResults( uploadedFiles, res );
        })
        .then( function(result) {
           rawFeedbackDB.addRawFeedbackToDB(req,res,tools, result );
        })
        .catch( function(err){
            res.status(500, {
                error: e
            });
        });

        manager.runJob();
    });
}
