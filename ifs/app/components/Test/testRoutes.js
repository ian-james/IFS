var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

module.exports = function( app ) {

    function prettyJson( filename ) {
        if( filename && filename != "") {
            var j = fs.readFileSync( filename, 'utf-8');
            j = JSON.parse(j);
            j = JSON.stringify(j,null,4);
            return j;
        }
        return "No contents available or incorrect file name";
    }

    app.get('/jobRequests', function(req,res, next ){
        var j = prettyJson( req.session.jobRequestFile );
        res.render( viewPath + "test", { "title":"Your Job Requets Data", "values":j });
    });

    app.get('/rawFeedback', function(req,res, next ){
        var j = prettyJson( req.session.allFeedbackFile );
        res.render( viewPath + "test", { "title":"Your Job Requets Data", "values":j });
    });

    app.get('/filesUploaded', function(req,res, next ){
        var j = prettyJson( req.session.uploadFilesFile );
        res.render( viewPath + "test", { "title":"Your Job Requets Data", "values":j });
    });
};