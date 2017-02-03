var router = require('express').Router();
var _ = require('lodash');

// Path and file management
var path = require('path');

var mkdirp = require('mkdirp');

var fs = require('fs');
var unzip = require('unzip');

// PRomises
var Q = require('q');

// Managers
var manager = require('../Queue/managerJob');
var ToolManager = require('../Tool/buildTool');
var Logger = require( path.join( __dirname, "/../../../config/" + "loggingConfig") );

var viewPath = path.join( __dirname + "/");

// Database
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

    /* Helper functions */
    function getYearMonthDayStr(){
        var dateObj = new Date();
        var arr = [ dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];
        return arr.join('-');
    }
    function getExt( filename ) {
        var extId = filename.lastIndexOf(".");
        return (extId >= 0 ? filename.substr(extId+1) : "");
    }

    function isZip(filename) {
        var ext = path.extname(filename);
        console.log("Checking is zip", ext);
        return  ext == ".zip" || ext == ".tar" || ext == '.gz';
    }

    function handleZipFile( zipfile )
    {
        if( zipfile && isZip(zipfile) ){
            
            //TODO: This has only been tested with zip.
            try {
                var stream = fs.createReadStream(zipfile);
                stream.on('error', function(error) {
                    Logger.error("Error caught error reading", error);
                });
                stream.pipe(unzip.Extract( {path: path.dirname(zipfile)} ) );
            }
            catch(err) {
                Logger.error("Unable to unzip file.")
            }

        }
    }


    /* Setup a file filter for upload*/
    var fileFilter = function(req,file,cb)
    {        
       var originalName = file.originalname;
        var extension = originalName.lastIndexOf(".");
        if( extension >= 0 )
        {
        // Insert accepted file types here
        // CIS files
        // PSY files
            var filetype = originalName.substr(extension+1);
            var acceptedTypes = [ 
                'json', 'cpp', 'c','h','lib',
                'doc','txt', 'text', 'docx', 'zip','tar'
            ];

            if( _.indexOf(acceptedTypes,filetype >= 0 ) ) {
                Logger.info("Successfully uploaded a file");
                return cb( null, true );
            }
            
        }

        Logger.error("Invalid file type selection");
        return cb( null, false, new Error("In valid file type."));
        
    }

    // Setup properties of storage of the file 
    var storage = multer.diskStorage({
        destination: function( req, file, callback ){

            // Check if a folder exists and make it if necessary.
            // Folder structure is upload/user/date/submissionTime
            // date will be year-month-date
            // submissionTime will need to include minutes and seconds.
            var dest = "./uploads";
            var username = "tester";
            
            if(req.user && req.user.username)
            {
                // Must be logged in
                username = req.user.username;
                var at = username.indexOf('@');
                username = username.substr(0, at >= 0 ? at : username.length );
            }
            console.log("USER", username);
            
            var submissionFolder = path.join(dest,username, getYearMonthDayStr(), "" + Date.now() );

            mkdirp(submissionFolder, function(err) {
                if(err) {
                    Logger.error("Unable to create folder for submission");
                    return callback(null,"/uploads");
                }
                else {
                    Logger.info("Folder Structure for ", submissionFolder, " has been created");
                    callback(null, submissionFolder);
                }
            });
            
            
        },
        filename: function( req, file, callback ) {
            var originalName = file.originalname;
            callback(null, originalName );
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
        var keys = [ 'originalname', 'filename','destination'];
        var uploadedFiles = _.map( files, obj => _.pick(obj, keys) );
        
        // Append uploads directory.
        _.forEach( uploadedFiles, function(f ){ 
            _.update(f, 'filename', obj => f.destination + "/" +  f.filename);
        })
        
        return uploadedFiles;
    }

    app.post('/tool/file/upload', upload.any(), function(req,res,next) {
        Logger.info("********************");
        Logger.info(req.body);
        Logger.info("END *********************");

        // Get files names to be inserted
        var uploadedFiles = getFileNames( req.files );

        handleZipFile( uploadedFiles[0].filename );

        var userSelection = req.body;
        userSelection['files'] = uploadedFiles;
        
        var tools = ToolManager.insertOptions( userSelection );

        manager.makeJob(tools).then( function( r ) {
            return manager.combineResults(r);
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
