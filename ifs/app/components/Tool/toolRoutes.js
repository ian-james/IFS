var router = require('express').Router();
var path = require('path');
var viewPath = path.join( __dirname + "/");


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
        console.log("HERE:" + file);
        var extension = originalName.lastIndexOf(".");
        if( extension >= 0 )
        {
            filename = file.name + "-" + Date.now() + '.' + originalName[extension+1];
            console.log(filename);
        }
        callback(null, file.fieldname + "-" + Date.now() );
    }
});

// This sets properties of the upload
// TODO: Currently set to accept anything for testing although a filter function exists.
var upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
}).any();


router.get('/', function( req, res , next ) {
    res.render( viewPath + "tool", { title: 'Tool Screen', message:"Something about tools"});
});

router.post('/file/upload', function(req,res,next) {

    console.log(" Currently in the file upload");

    upload( req,res, function(err) {
        if( err ) {
            console.log("Error: upload file");
            return res.end("Error: uploading");
        }
        else {
            console.log("Upload might have worked.");
            res.end("File is uploaded");
        }
    });

});

module.exports = router;