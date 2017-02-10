var router = require('express').Router();
var _ = require('lodash');

// Path and file management
var path = require('path');

// Managers
var manager = require('../Queue/managerJob');
var ToolManager = require('../Tool/buildTool');
var Logger = require( __configs + "loggingConfig");

// Database
//var db = require('../../../config/database');
//var config = require('../../../config/databaseConfig');
var rawFeedbackDB = require('../Feedback/feedbackDatabase.js');

var Helpers = require("./fileUploadHelpers");
var upload = require("./fileUploadConfig").upload;



module.exports = function (app) {

    app.post('/tool/file/upload', upload.any(), function(req,res,next) {

        console.log("Helpers", Helpers);
        Logger.info("********************");
        Logger.info(req.body);
        Logger.info("Files *********************");
        Logger.info(req.files);
        Logger.info("END *********************");

        // Get files names to be inserted
        var uploadedFiles = Helpers.getFileNames( req.files );

        Helpers.handleZipFile( uploadedFiles[0].filename );

        var userSelection = req.body;
        userSelection['files'] = uploadedFiles;
        
        var tools = ToolManager.createJobRequests( userSelection );

        manager.makeJob(tools).then( function( r ) {
            return manager.combineResults(r);
        })
        .then( function(result) {
           rawFeedbackDB.addRawFeedbackToDB(req,res,tools,result );
        })
        .catch( function(err){
            res.status(500, {
                error: e
            });
        });

        manager.runJob();
    });
}
