var router = require('express').Router();
var path = require('path');
var viewPath = path.join( __dirname + "/");
var ccp = require(viewPath + 'createChildProcess.js');
var hunspellData = ccp.testObj;

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
                console.log(filename);
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

        console.log(" Currently in the file upload");
        console.log("********************");
        console.log(req.body);
        console.log("END *********************");

        //for each file create a subdirectory to test their functions or whatever
        // files[i].originalName
        // 
        // We should generate a model for the quesiton while this runs
        // Create the child process here.
        
        /* This example will run hunspell and output to the console.
        console.log("Before Tool upload");
        console.log(req.files[0]);
        var file = req.files[0].filename;
        console.log(req.files[0].filename);

        // Pop the temporary file name.
        hunspellData.targs.pop();
        hunspellData.targs.push( req.files[0].path );
        var hunspellTool = ccp.hunspellTool( hunspellData.progName, hunspellData.targs );
        console.log("After Tool upload");
        res.end("File is uploaded");
        */
        
        /*
        upload( req,res, function(err) {
            if( err ) {
                console.log("Error: upload file");
                return res.end("Error: uploading");
            }
            else {
                console.log("Before Tool upload");
                var hunspellTool = ccp.hunspellTool( hunspellData.progName, hunspellData.args );
                console.log("After Tool upload");
                res.end("File is uploaded");
            }
        });
        */
        
    });
}