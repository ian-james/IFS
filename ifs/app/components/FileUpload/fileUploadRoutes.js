var router = require('express').Router();
var path = require('path');
var Q = require('q');
var viewPath = path.join( __dirname + "/");
var _ = require('lodash');

var manager = require('../Queue/managerJob');
var Logger = require( path.join( __dirname, "/../../../config/" + "loggingConfig") );

var ToolManager = require('../Tool/buildTool');

var db = require('../../../config/database');
var config = require('../../../config/databaseConfig');


module.exports = function (app) {

    // Files upload Information
    // Middleware for uploading multipart files and form data
    // Include this once we need to upload the files.
    var multer = require('multer');

    var limits = {
        fileSize: 1024*1024*5
    };

    /* Setup a file filter for upload*/
    var fileFilter = function(req,file,cb)
    {        
        var type = file.mimetype;
        var typeArray = type.split('/');

        // Insert accepted file types here
        // CIS files
        // PSY files
        var acceptedTypes = [ 
            '', 'json', 'cpp', 'c','h','lib',
            'doc','txt', 'docx'
        ];
        
        if( acceptedTypes.indexOf(type) >= 0 )
            return cb( null, false, new Error("In valid file type."));
        cb( null, true );
    }

    // Setup properties of storage of the file 
    var storage = multer.diskStorage({
        destination: function( req, file, callback ){
            callback(null, './uploads')
        },
        filename: function( req, file, callback ) {
            var originalName = file.originalname;
            var extension = originalName.lastIndexOf(".");
            if( extension >= 0 )
            {
                filename = originalName.substr(0,extension) + "-" + Date.now() +  originalName.substr(extension);
                Logger.info(filename);
            }
            callback(null, filename );
        }
    });

    // This sets properties of the upload
    // TODO: Currently set to accept anything for testing although a filter function exists.
    var upload = multer({
        storage: storage,
        limits: limits,
        fileFilter: fileFilter
    });

    // This function gets the file names from Multer, appends the uploads directory
    // and keeps only the "likely" required keys for future processing.
    function getFileNames( files ) {
        // Retrieve all files original name and new server name
        var keys = [ 'originalname', 'filename'];
        var uploadedFiles = _.map( files, obj => _.pick(obj, keys) );
        
        // Append uploads directory.
        _.forEach( uploadedFiles, function(f ){ 
            _.update(f, 'filename', obj => "./uploads/" +  f.filename)
        })
        
        return uploadedFiles;
    }

    app.post('/tool/file/upload', upload.any(), function(req,res,next) {
        Logger.info("********************");
        Logger.info(req.body);
        Logger.info("END *********************");

        // Get files names to be inserted
        var uploadedFiles = getFileNames( req.files );

        var userSelection = req.body;
        userSelection['files'] = uploadedFiles;

        var tools = ToolManager.insertOptions( userSelection );

        manager.makeJob(tools).then( function(x) {
            var allResults = [];
            for(var i = 0;i < x['result'].length;i++) {
               var tempJob = x['result'][i].job;
               tempJob['result'] = x['result'][i].result;
               Logger.info("J",i, ":",  tempJob );
               allResults.push(tempJob);
            }
            return allResults;
        })
        .then( function(result) {
            if(req.user && req.user.username)
            {                // Store the result in a database and move on
                var insertReq = "INSERT INTO " + config.raw_feedback_table + " (username, tools, feedback) values (?, ?, ?)";

                db.query(insertReq,[req.user.username, JSON.stringify(tools), JSON.stringify(result)], function(err,data){
                    
                    if( err ) {
                        console.log("INSERT ERROR:", err );
                    }
                    console.log("INSERTED FEEDBACK");
                    res.render(viewPath + "../Feedback/feedbackWaiting", { title: 'Feedback', test:"Tester", result:result});
                    res.end();
                    console.log("ENDING");
                });
            }
            else
            {
                res.render(viewPath + "../Feedback/feedbackWaiting", { title: 'Feedback', test:"Tester", result:result});
                res.end();
                console.log("ENDING");
            }
        })
        .catch( function(err){
            res.status(500, {
                error: e
            });
        });

        manager.runJob();
        
    });
}