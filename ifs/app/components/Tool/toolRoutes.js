var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var _ = require('lodash');
var Logger = require( __configs + "loggingConfig");

var Constants = require( __components + "Constants/programConstants");
var SurveyManager = require( __components + "Survey/surveyManager");
var SurveyBuilder = require(__components + "Survey/surveyBuilder");
var Survey = require( __components + "Survey/survey");

var preferencesDB = require( __components + 'Preferences/preferenceDB.js');
var TipManager = require(__components + 'TipManager/tipManager.js');

module.exports = function(app) {

    /**
     * Takes the tool preferences and the tools and updates the curren default and preferred values.
     * @param  {[type]} toolPreferences [description]
     * @param  {[type]} tools           [description]
     * @return {[type]}                 [description]
     */
    function updateJsonWithDbValues( toolPreferences, tools ){
        var toolPrefix = "enabled-";
        var optionPrefix = "opt-";
        for( var i = 0; i < toolPreferences.length; i++ ) {

            var optionName = toolPreferences[i].toolName;
            if( _.startsWith(optionName,toolPrefix) ) {
                //Enable the tool checkbox
                optionName = _.replace(optionName,toolPrefix,"");
                var r = _.find(tools,_.matchesProperty('displayName',optionName));
                if(r)
                    r['prefValue'] = toolPreferences[i].toolValue == "true";
            }
            else if(_.startsWith(optionName,optionPrefix) ) {
                var r = undefined;
                for(var y = 0; y < tools.length && !r; y++){
                    var options = tools[y].options;
                    r = _.find(options, _.matchesProperty("name", optionName));
                    if( r ){
                        if(r.type == "checkbox")
                            r['prefValue'] = toolPreferences[i].toolValue == "on";
                        else if(r.type == "select" || r.type == "text")
                            r['prefValue'] = toolPreferences[i].toolValue;
                    }
                }
            }
        }
    }

    app.get('/tool/data', function(req,res) {
        fs.readFile( req.session.toolFile, 'utf-8', function( err, toolData ) {
            if( err ) {
                //Unable to get supported tools file, larger problem here.
                Logger.error(err);
                res.end();
            }
            else {
                //Load JSON tool file and send back to UI to create inputs
                preferencesDB.getStudentPreferencesByToolType(req.user.id, req.session.toolSelect, function(err, toolPreferences){

                    var jsonObj = JSON.parse(toolData);
                    var tools = jsonObj['tools'];

                    if(toolPreferences)
                        updateJsonWithDbValues(toolPreferences,tools);
                    res.json(tools);
                });
            }
        });
    });

    /**
     * This loads all the survey data required for loading time.
     * @param  {[type]} req  [description]
     * @param  {[type]} res  [description]
     * @param  {[type]} next )             {                var userId [description]
     * @return {[type]}      [description]
     */
    app.get('/tool', function(req, res, next) {
        var userId = req.user.id || req.passport.user;

        TipManager.selectTip(req,res, userId, function() {
            SurveyManager.getUserSurveyProfileAndSurveyType(userId, function(err,surveyPrefData) {
                if( err || !__EXPERIMENT_ON ) {
                    res.render( viewPath + "tool", { "title": req.session.toolSelect + ' Tools', "surveyQuestions":[] } );
                }
                else {
                    SurveyManager.setupSurvey(req.session.toolSelect.toLowerCase(), surveyPrefData, function(err, selectedSurveyData) {
                        if( err || !selectedSurveyData ) {
                            res.render( viewPath + "tool", { "title": req.session.toolSelect + ' Tools', "surveyQuestions":[] } );
                        }
                        else {
                            var opts = Constants.surveyDisplayDefaultOptions();
                            var surveyId = selectedSurveyData.data.surveyId;
                            var options = selectedSurveyData.options;

                            // Set pulse survey size
                            options.range[1] = Math.min( options.range[0] + opts.pulseQuestions, options.range[1]);
                            var surveyData = selectedSurveyData;
                            
                            SurveyBuilder.getSurveySection(surveyData.data, options, function( err, data ) {
                                data = data ? JSON.stringify(data) : [];
                                res.render( viewPath + "tool", { "title": req.session.toolSelect + ' Tool Screen', "surveyQuestions":data } );
                            });
                        }
                    });
                }
            });
        });
    });
}
