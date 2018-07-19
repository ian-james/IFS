var path = require('path');
var viewPath = path.join( __dirname + "/");
var he = require('he');

var fs = require('fs');
var Feedback = require('./feedbackSetup');

var db = require( __configs + 'database');
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

var feedbackEvents = require(__components + "InteractionEvents/feedbackEvents");



module.exports = function( app ) {

    function getDefaultPage() {
         return { title: 'Submission Feedback' };
    }
/**************************  Values Controller *************************/
    /**
     * Read the feedback information file
     *  and process and highlight
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    function  showFeedback( req,res, opt, callback ) {
        if(!req.session.uploadFilesFile) {
            req.flash('errorMessage', "Feedback is not currently available, please upload again.");
            res.location("/tool");
            res.redirect("/tool");
            res.end();
            return;
        }

        //TODO Feedback could be received by type (optimizaiton)
        var r = feedbackEvents.getMostRecentFeedbackNonVisual( req.user.id );
        db.query(r.request,r.data, function(err,data){
            if(err) {
                Logger.error(err);
                res.end();
            }
            else {
                var filesContent = fs.readFile( req.session.uploadFilesFile, 'utf-8', (err,filesContent) => {
                    var feedbackFile = "{" +
                    '"files": ' + filesContent + ",\n" +
                    '"feedback":' + JSON.stringify(data) + ',\n' +
                    '"runType": ' + JSON.stringify(req.session.toolSelect) + '\n'
                    +"}\n";

                    var page = getDefaultPage();
                    var feedback = Feedback.setupFeedback(feedbackFile, opt);
                    var result = _.assign(page,feedback);

                    var rstats = feedbackEvents.getMostRecentFeedbackStats( req.user.id );
                    db.query(rstats.request,r.data, function(err, statData) {

                        var stats = Feedback.setupFeedbackStats(statData);
                        result = _.assign(result,stats);

                        var rvisualTools = feedbackEvents.getMostRecentVisualTools( req.user.id );
                        db.query(rvisualTools.request,rvisualTools.data, function(errTools,visualTools) {

                            var visualTools = Feedback.setupVisualFeedback(visualTools);
                            results = _.assign(result,visualTools);
                            _.extend(results, {'runType': req.session.toolSelect.toLowerCase()})
                            callback(results);
                        });
                    });
                });
            }
        });
    };

    app.get('/feedbackStatsTable', function(req,res) {
        var opt = {};
        showFeedback(req,res, opt , function(results) {
            res.render( viewPath + "feedbackStatsFullTable.pug", results );
        });
    });

    app.get('/feedback', function(req, res) {
        var opt = {};

        showFeedback(req,res,opt, function(results) {      
            res.render( viewPath + "feedback", results );
        });
    });

    app.post('/feedback', function(req, res, next) {
        var opt = { 'tool': req.body.toolSelector };
        req.session.activeTool = req.body.toolSelector;

        showFeedback(req,res,opt, function(results) {
            res.render( viewPath + "feedback", results );
        });
    });

   app.get('/feedback/data', function(req,res,next) {
        var opt = {};
        if( req.session.activeTool )
            opt['tool'] = req.session.activeTool;
        showFeedback(req,res,opt, function(results){
            res.json(results);
        });
   });
}