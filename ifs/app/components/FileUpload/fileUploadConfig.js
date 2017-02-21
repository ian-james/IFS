

// Files upload Information
// Middleware for uploading multipart files and form data
// Include this once we need to upload the files.

// Path and file management
var path = require('path');
var _ = require('lodash');
var multer = require('multer');
var mkdirp = require('mkdirp');

var Logger = require( __configs + "loggingConfig" );

var limits = {
    fileSize: 1024*1024*5
};

var Helpers = require('./fileUploadHelpers');

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
        if(req.user && req.user.username)
        {
            // Must be logged in
            username = req.user.username;
            var at = username.indexOf('@');
            username = username.substr(0, at >= 0 ? at : username.length );
        }

        // LIttle Time Hack to keep all the submission files in the same output folder but also timebased.
        var submissionTime = Date.now();
        submissionTime = Math.floor( submissionTime / 100 );

        var submissionFolder = path.join(dest,username, Helpers.getYearMonthDayStr(), "" + submissionTime);

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

module.exports.upload = upload;