var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");
var _ = require('lodash');

var Constants = require( __components + "Constants/programConstants");
var SurveyManager = require( __components + "Survey/surveyManager");
var SurveyBuilder = require(__components + "Survey/surveyBuilder");
var Survey = require( __components + "Survey/survey");

var preferencesDB = require( __components + 'Preferences/preferenceDB.js');

module.exports = function (app) {

    /* Solution #2 for connecting Express and Angular makes a 2nd route called data to http req*/

    function setupDefaultTool(req) {
        //TODO: Move this to register and login pages.
        if( req.session && !(req.session.toolSelect && req.session.toolFile ) ) {
            var supportedToolsFile = './tools/toolListProgramming.json';

            if( req.session.toolSelect  == "Writing") {
                supportedToolsFile  = './tools/toolList.json';
                req.session.toolSelect = 'Writing';
                req.session.toolFile = supportedToolsFile;
            }
            else {
                req.session.toolSelect = 'Programming';
                req.session.toolFile = supportedToolsFile;
            }
        }
    }

    app.get('/tool/data', function(req,res) {

        setupDefaultTool(req);

        fs.readFile( req.session.toolFile, 'utf-8', function( err, toolData ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                console.log(err);
                res.end();
            }
            else {
                //Load JSON tool file and send back to UI to create inputs

                preferencesDB.getStudentPreferencesByToolType(req.user.id, req.session.toolSelect, function( err, toolPreferences){

                    var jsonObj = JSON.parse(toolData);
                    var tools = jsonObj['tools'];

                    var toolPrefix = "enabled-";
                    var optionPrefix = "opt-";

                    if(toolPreferences){
                        for( var i = 0; i < toolPreferences.length; i++ ) {

                            var optionName = toolPreferences[i].toolName;
                            //console.log("TRying Name", optionName);
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
                                        else if(r.type == "select")
                                            r['prefValue'] = toolPreferences[i].toolValue;
                                    }
                                }
                            }
                        }
                    }
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
    app.get('/tool', function( req, res , next ) {
        
        setupDefaultTool(req);

        var userId = req.user.id || req.passport.user;
        SurveyManager.getUserSurveyProfile(userId, function(err,surveyPrefData) {
            //Array of preferences per survey.            
            SurveyManager.setupSurvey( surveyPrefData, function(err, selectedSurveyData) {
                if(err || !selectedSurveyData) {
                    res.render( viewPath + "tool", { "title": req.session.toolSelect + ' Tools', "surveyQuestions":[] } );
                }
                else {
                    var opts = Constants.surveyDisplayDefaultOptions();
                    var surveyId = selectedSurveyData.data.surveyId;
                    var options = selectedSurveyData.options;

                    // Set pulse survey size
                    options.range[1] = Math.min( options.range[0] + opts.pulseQuestions, options.range[1]);

                    Survey.getSurveyId(surveyId, function(err,surveyData) {
                        if( surveyData && surveyData.length >= 1)
                        {
                            SurveyBuilder.getSurveySection(surveyData[0], options, function( err, data ) {
                                data = JSON.stringify(data);
                                res.render( viewPath + "tool", { "title": req.session.toolSelect + ' Tool Screen', "surveyQuestions":data } );
                            });
                        }
                        else {
                            res.render( viewPath + "tool", { "title": req.session.toolSelect + ' Tool Screen', "surveyQuestions":[] } );
                            res.end();
                        }
                    });
                }
            });
        });
    });
}