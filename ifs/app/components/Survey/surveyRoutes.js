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

var moment = require('moment');

module.exports = function (app, iosocket ) {

    app.get('/surveys', function(req,res) {

        SurveyManager.getUserSurveyProfileAndSurveyType(req.user.id, function(err, surveyData) {
            var keys = ['surveyId','lastRevision', 'currentSurveyIndex', 'surveyName','title', 'surveyField'];
            var ans = _.map(surveyData, obj=> _.pick(obj,keys));

            ans = _.map(ans, function( obj ) {
                var rev = obj['lastRevision'];
                if( rev )
                    obj['lastRevision'] = moment(obj['lastRevision']).format("hh:mm a DD-MM-YYYY");
                return obj;
            });

            res.render(viewPath + 'surveyList', { 'title': "Survey List", "surveys": ans});
        });

    });
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
                    SurveyPreferences.getSurveyPreferences(userId, surveyId, function(err,surveyPrefData) {
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

                        // IF all the questions where submitted we increment the surveyIndex because it will need to be a 'new'
                        //  survey. Even if the old survey was in progress.
                        if(resultsToDb.length == surveyLastIndex )
                            surveyIndex++;

                        // Organize results for survey response database.
                        for(var i = 0; i < qids.length && i < answers.length;i++) {
                            resultsToDb.push( [ userId, surveyId,  qids[i], answers[i], surveyIndex ]);
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

                        // Set the Preferences question Index
                        SurveyPreferences.setQuestionCounter(userId,surveyId,lastId, function(err,qData) {
                            if(err)
                                Logger.error("Unable to increment survey counter:" + surveyId + ": userId" + userId );
                        });

                        // Check if survey was finished update counter, user survey preferences.
                        if( lastId == surveyLastIndex ){
                            SurveyPreferences.incrementSurveyIndex(userId, surveyId, function(err,qData) {
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