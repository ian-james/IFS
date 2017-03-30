var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require('fs');
var _ = require('lodash');

module.exports = function( app ) {

    function prettyJson( filename ) {
        var j = fs.readFileSync( filename, 'utf-8');
        j = JSON.parse(j);
        j = JSON.stringify(j,null,4);
        return j;
    }

    app.get('/jobRequests', function(req,res, next ){

        var j = "No contents available or incorrect file name";
        if(  req.session.jobRequestFile ) {
            j = prettyJson( req.session.jobRequestFile );
        }
        res.render( viewPath + "test", { "title":"Your Job Requets Data", "values":j });
    });

    app.get('/rawFeedback', function(req,res, next ){
       var j = "No contents available or incorrect file name";
        if(  req.session.allFeedbackFile ) {
            j = prettyJson( req.session.allFeedbackFile );
        }
        res.render( viewPath + "test", { "title":"Your Raw Feedback", "values":j });
    });
};