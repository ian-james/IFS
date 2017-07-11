var path = require('path');
var viewPath = path.join( __dirname + "/");

var fs = require('fs');
var Feedback = require('./feedbackSetup');

var db = require( __configs + 'database');
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

var feedbackEvents = require(__components + "InteractionEvents/feedbackEvents");

module.exports = function( app ) {

/**************************  Values Controller *************************/
    /**
     * Read the feedback information file
     *  and process and highlight
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    function  showFeedback( req,res, opt ) {

        if(!req.session.uploadFilesFile) {
            req.flash('errorMessage', "Feedback is not currently available, please upload again.");
            res.location("/tool");
            res.redirect("/tool");
            res.end();
            return;
        }

        var r = feedbackEvents.getMostRecentFeedbackNonVisual( req.user.id );
        db.query(r.request,r.data, function(err,data){
            if(err) {
                Logger.error(err);
                res.end();
            }
            else {
                var filesContent = fs.readFileSync( req.session.uploadFilesFile, 'utf-8');
                var feedbackFile = "{" +
                    '"files": ' + filesContent + ",\n" +
                    '"feedback":' + JSON.stringify(data) + '\n'
                    +"}\n";

                var page = { title: 'Feedback page' };
                var feedback = Feedback.setupFeedback(feedbackFile, opt);
                var result = _.assign(page,feedback);

                var rstats = feedbackEvents.getMostRecentFeedbackStats( req.user.id );
                db.query(rstats.request,r.data, function(err, statData) {

                    var stats = Feedback.setupFeedbackStats(statData);
                    result = _.assign(result,stats);

                    // Will fix this later/soon
                    var rvisualTools = feedbackEvents.getMostRecentVisualTools( req.user.id );
                    console.log(rvisualTools);
                    db.query(rvisualTools.request,rvisualTools.data, function(errTools,visualTools) {

                        var visualTools = Feedback.setupVisualFeedback(visualTools);
                        console.log(visualTools);
                        results = _.assign(result,visualTools);
                        var viewFile = opt && opt.viewPathFile ? opt.viewPathFile: "feedback";
                        res.render( viewPath + viewFile, result );
                    });
                });
            }
        });
    };

    app.get('/feedbackStatsTable', function(req,res) {
        showFeedback(req,res,{viewPathFile:'feedbackStatsFullTable.pug'});
    });

    app.get('/feedback', function(req, res) {
       showFeedback(req,res);
    });

    app.post('/feedback', function(req, res, next) {
        var opt = { 'tool': req.body.toolSelector };
        req.session.activeTool = req.body.toolSelector;
        showFeedback(req,res,opt);
    });

    app.get('/feedback/data', function( req,res, next ){
        if(!req.session.uploadFilesFile) {
            req.flash('errorMessage', "Feedback is not currently available, please upload again.");
            res.json({});
            res.end();
        }
        var r = feedbackEvents.getMostRecentFeedbackNonVisual( req.user.id );
        db.query(r.request,r.data, function(err,data){
            if(err) {
                Logger.error.log(err);
                res.end();
            }
            else {
                var filesContent = fs.readFileSync( req.session.uploadFilesFile, 'utf-8');
                var feedbackFile = "{" +
                    '"files": ' + filesContent + ",\n" +
                    '"feedback":' + JSON.stringify(data) + '\n'
                    +"}\n";

                var opt = {};
                if( req.session.activeTool ) {
                    opt['tool'] = req.session.activeTool;
                }
                var result = Feedback.setupFeedback( feedbackFile, opt );

                var rstats = feedbackEvents.getMostRecentFeedbackStats( req.user.id );
                db.query(rstats.request,r.data, function(err, statData) {

                    var stats = Feedback.setupFeedbackStats(statData);
                    result = _.assign(result,stats);
                    res.json( result );
                });
            }
        });
    });
}
