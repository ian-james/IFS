var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var db = require( __configs + 'database');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");
var Survey = require( __components + "/Survey/survey");
var Question = require( __components + "Survey/question")
var Errors = require(__components + "Errors/errors");

var SurveyManager = require( __components + "Survey/surveyManager");
var SurveyBuilder = require( __components + "Survey/surveyBuilder");
var SurveyPreferences = require( __components + "Survey/surveyPreferences");
var SurveyResponse = require(__components + "Survey/surveyResponse");

var event = require(__components + "InteractionEvents/buildEvent.js" );
var tracker = require(__components + "InteractionEvents/trackEvents.js" );

module.exports = function (app, iosocket ) {
    /**
     * Method gets the full survey and displays it.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   var surveyName [description]
     * @return {[type]}      [description]
     */
    app.get('/survey:surveyName', function(req,res) {
        var surveyName = req.params.surveyName;
        Survey.getSurvey(surveyName, function(err,surveyData) {
            if( err ) {
                Logger.error(err);
            }
            else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
            {
                SurveyBuilder.loadSurveyFile( surveyData[0], function(err,data){
                    var sqs = JSON.stringify(data);
                    res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
                });
            }
            else {
                // Could throw an error here indicating failure to reach survey
                res.end();
            }
        });
    });

    /**
     * This function receives the survey data from SurveyJS and parses it and
     * updates the databases with relevenat information.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {                   try {            var title [description]
     * @return {[type]}      [description]
     */
    app.post( '/survey/sentData', function(req,res) {

        try {
            var title = req.body['title'];
            var results = req.body['result'];

            Survey.getSurveyByTitle(title, function(err,data){
                if(err) {
                    Logger.error("ERRR< GETTING TITLE", err);
                }

                if(data && data.length > 0) {
                    var surveyId = data[0].id;
                    var userId = req.user.id || req.passport.user;

                    SurveyPreferences.getSurveyPreferences(surveyId,userId, function(err,surveyPrefData) {

                        if(err) {
                            Logger.error("Unable to get Survey Preferences");
                            return;
                        }

                        var surveyIndex = surveyPrefData[0].currentSurveyIndex;
                        var surveyLastIndex = surveyPrefData[0].lastIndex;

                        var resultsToDb = [];
                        var qids = [];
                        var answers = [];
                        var lastId = 0;

                        // For each Question section, get question key and value into a single array.
                        // ex) sews1 value 1
                        var ks = Object.keys(results);

                        for( var i= 0; i < ks.length;i++) {
                            var k = ks[i];
                            qids = qids.concat( _.keys(results[k]) );
                            answers = answers.concat( _.values(results[k]) );
                        }

                        // Get the index of the last question answered.
                        for(var i = 0; i < qids.length && i < answers.length;i++) {

                            var qid = qids[i];
                            var m = qid.toString().match( /[a-zA-Z]*(\d*)/);
                            if( m && m.length > 1 ) {
                                lastId = Math.max(lastId, parseInt(m[1]) );
                            }
                        }
                        // Organize results for survey response database.
                        for(var i = 0; i < qids.length && i < answers.length;i++) {
                            resultsToDb.push( [ surveyId, userId, qids[i], answers[i],surveyIndex ]);
                        }

                        // Insert the response to the survey into DB.
                        async.map(resultsToDb,
                            SurveyResponse.insertSurveyResponse,
                            function(err,d){
                                if(err) {
                                    Logger.error("ERROR: inserting Survey Response");
                                }
                            }
                        );

                        tracker.trackEvent(iosocket, event.surveyEvent(req.user.sessionId, req.user.id, "addSection", {
                             "surveyId": surveyId,
                             "questionIds": qids,
                             "questionsAnswered": qids.length,
                             "lastQuestion": lastId,
                             "surveyIndex": surveyIndex
                        }));

                        // Set the Preferences qestion Index
                        SurveyPreferences.setQuestionCounter(surveyId,userId,lastId, function(err,qData) {
                            if(err)
                                Logger.error("Unable to increment survey counter:" + surveyId + ": userId" + userId );
                        });

                        // Check if survey was finished update counter, user survey preferences.
                        if( lastId == surveyLastIndex ){
                            SurveyPreferences.incrementSurveyIndex(surveyId,userId, function(err,qData) {
                                if(err)
                                    Logger.error("Unable to increment survey counter:" + surveyId + ": userId" + userId );
                            });
                        }
                    });
                }
            });
        }
        catch(e) {
            Logger.error("Could not save data from survey");
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.json( Errors.cErr("Could not save data from survey") );
            res.end();
        }
    });
}