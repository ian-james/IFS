var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");

var Constants = require( __components + "Constants/programConstants");
var SurveyManager = require( __components + "Survey/surveyManager");
var SurveyBuilder = require(__components + "Survey/surveyBuilder");
var Survey = require( __components + "Survey/survey");

module.exports = function (app) {

    /* Solution #2 for connecting Express and Angular makes a 2nd route called data to http req*/
    app.get('/tool/data', function(req,res) {
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
        
        fs.readFile( supportedToolsFile, 'utf-8', function( err, data ) {
            if( err ) {
                //Unable to get support tools file, larger problem here.
                console.log(err);
            }
            else {
                //Load JSON tool file and send back to UI to create inputs
                var jsonObj = JSON.parse(data);
                res.json(jsonObj['tools']);
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
        
        var userId = req.user.id || req.passport.user;
        SurveyManager.getUserSurveyProfile(userId, function(err,surveyPrefData) {
            //Array of preferences per survey.            
            SurveyManager.setupSurvey( surveyPrefData, function(err, selectedSurveyData) {
                if(err || !selectedSurveyData) {
                    res.render( viewPath + "tool", { "title": req.session.toolSelect + ' Tool Screen', "surveyQuestions":[] } );
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