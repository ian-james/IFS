var router = require('express').Router();
var path = require('path');
var Q = require('q');
var viewPath = path.join( __dirname + "/");

var manager = require('../Queue/managerJob');
var Logger = require( path.join( __dirname, "/../../../config/" + "loggingConfig") );

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

    app.post('/tool/file/upload', upload.any(), function(req,res,next) {
        //console.log("********************");
        Logger.info(req.body);
        //console.log("END *********************");

        var temp = [{
            displayName: "Display Hunspell ",
            progName: 'ls',
            options: ' -l | grep ad'
        },
        {
            displayName: "Grammarly",
            progName: "ls",
            options:" -lh | grep ts"
        }];

        manager.makeJob(temp).then( function(x) {
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
            res.render(viewPath + "../Feedback/feedbackWaiting", { title: 'Feedback', test:"Tester", result:result});
            res.end();
        })
        .catch( function(err){
            res.status(500, {
                error: e
            });
        });

        manager.runJob();
        
    });
}