var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');
var Feedback = require('./feedbackSetup');


var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

module.exports = function( app ) { 


/**************************************************************  Values Controller *************************/
    /* 
        Read the feedback information file 
        and process and highlight
    */
    app.get('/feedback', function(req,res, next ){
      
        var page = { title: 'Feedback page' };
        var feedbackFile = req.session.allFeedbackFile;
        var feedback = Feedback.setupFeedback(feedbackFile);
        var result = _.assign(page, feedback);
        res.render( viewPath + "feedback", result );
    });

    app.post('/feedback', function(req,res,next){

        // Would really like to reuse the previously send information.
        // Get and Post are the essentially the same until ...I figure out resuse of feedbackObject
        // As this could essecially just be a filter  with the new tool name.
        
        var opt = { 'tool': req.body.toolSelector };
        req.session.activeTool = req.body.toolSelector;

        var page = { title: 'Feedback Test page' };
        var feedbackFile = req.session.allFeedbackFile
        var feedback = Feedback.setupFeedback(feedbackFile, opt);
        var result = _.assign(page,feedback);
        res.render( viewPath + "feedback", result );

    });

    app.get('/feedback/data', function( req,res, next ){
        var supportedToolsFile = req.session.allFeedbackFile;
        fs.readFile( supportedToolsFile, 'utf-8'  , function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                Logger.error("Error unable to load feedbackFiles");
            }
            else {
                //Load JSON tool file and send back to UI to create inputs
                var opt = {};
                if( req.session.activeTool ) {
                    opt['tool'] = req.session.activeTool;
                }
                var result = Feedback.readFeedbackFormat( data, opt );
                res.json( result );
            }
        });
    });
}