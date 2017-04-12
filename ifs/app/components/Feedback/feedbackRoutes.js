var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');
var Feedback = require('./feedbackSetup');


var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

module.exports = function( app ) { 


/**************************************************************  Values Controller *************************/
    /**
     * Read the feedback information file 
     *  and process and highlight
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    function  showFeedback( req,res, opt ) {

        var page = { title: 'Feedback Test page' };
        var feedbackFile = req.session.allFeedbackFile
        var feedback = Feedback.setupFeedback(feedbackFile, opt);
        var result = _.assign(page,feedback);
        res.render( viewPath + "feedback", result );
    }
  
    app.get('/feedback', function(req,res ){
       showFeedback(req,res);
    });

    app.post('/feedback', function(req,res,next){
        var opt = { 'tool': req.body.toolSelector };
        req.session.activeTool = req.body.toolSelector;
        showFeedback(req,res,opt);
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