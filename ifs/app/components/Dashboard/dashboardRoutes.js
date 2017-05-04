var path = require('path');
var viewPath = path.join( __dirname + "/");
var fs = require("fs");

var Constants = require( __components + "Constants/programConstants");
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");

var async = require('async');

module.exports = function (app, iosocket ) {
   
    app.get( '/trackedEvent', function(req,res){
        res.render( viewPath + "trackedEvents", {title:"Tracked Events Logger"});
    });

    app.get('/dashboard', function( req, res , next ) {
        
        var userId = req.user.id || req.passport.user;
        SurveyManager.getUserSurveyProfile(userId, function(err,surveyPrefData) {
            //Array of preferences per survey.            
            SurveyManager.setupSurvey( surveyPrefData, function(err, selectedSurveyData) {
                if(err || !selectedSurveyData) {
                    res.render( viewPath + "tool", { "title": 'Tool Screen', "surveyQuestions":[] } );
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
                                res.render( viewPath + "tool", { "title": 'Tool Screen', "surveyQuestions":data } );
                            });
                        }
                        else {
                            res.render( viewPath + "tool", { "title": 'Tool Screen', "surveyQuestions":[] } );
                            res.end();
                        }
                    });
                }
            });
        });
    });
}