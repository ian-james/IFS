

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


function acceptableFileTypes() {
    return ['json', 'cpp', 'c','h','txt', 'text', 'doc', 'docx', 'zip','tar', 'odt' ];
}

function acceptableMimeType() {
    return [
    'text/plain',
    'text/markdown',
    'application/json', 
    'application/zip',
    'application/x-compressed-zip',
    'application/x-tar',
    'application/msword',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
}


  /* Setup a file filter for upload*/
var fileFilter = function(req,file,cb)
{
    var allowMimeTypes = acceptableMimeType();
    var mimetype = file.mimetype;

    if( _.includes(allowMimeTypes,mimetype) ) {
        Logger.info("Allow upload of file", file.originalname);
        return cb( null, true );
    }

    Logger.error("Invalid file type selection", file.mimetype);
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