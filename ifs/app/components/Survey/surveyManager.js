/*
  Survey Manager - decides which questions to ask and when.
 */
var _ = require('lodash');
var async = require('async');
var Logger = require( __configs + "loggingConfig");
//var SurveyMeta = require( __components + 'Survey/SurveyMetaData');

var mysql = require('mysql');
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

var SurveyBuilder = require( __components + "Survey/surveyBuilder");
var Survey = require( __components + "/Survey/survey");

module.exports = {

    getUserSurveyProfile: function( userId, callback ) {
        // Call to the user's survey profiel data base
        try
        {            
            var req = "SELECT * FROM " + config.survey_preferences_table + " where userId = ?";
            db.query(req,userId, function(err,data){
                callback(err,data);
            });
        }
        catch (e) {
            Errors.logErr( e );
        }
    },

    /**
     * Considers if quesiton should be asked based on most recent asking time.
     * @param  {[type]} surveyPrefData [description]
     * @return {[type]}                [description]
     */
    shouldAskQuestion: function( surveyPrefData ) {
        // Check the information to evaluate if this should take place
        // TODO: FIX THIS FROM ALWAYS TRUE.
        var timeBetweenQuestions = 5; //mins
        return _.some(surveyPrefData, function(s) {
            //return s.lastRevision < timeBetweenQuestions;
            return true;
        });
        
    },

    /**
     * Select A survey from all available options.
     * @param  {[type]} surveyPrefData [description]
     * @return {[type]}                [description]
     */
    selectSurvey: function( surveyPrefData ) {

        if(surveyPrefData.length == 0 )
            return [];

        var active = this.organizeSurveyChoices(surveyPrefData);

        if( active.length == 0 ) {
            // Start a new survey
            // Currently just picking the oldest start time
            return this.startNewSurvey(surveyPrefData);
        }
        return active[0];
    },

    organizeSurveyChoices: function(surveyPrefData) {
        var prefsOrder = ['lastRevision','surveyStartData','currentIndex'];
        var active = this.getActiveSurveys(surveyPrefData);
        active = _.sortBy(active,prefsOrder);
        return active;
    },

    qstartNewSurvey: function(surveyPrefData ) {
       var completed = getCompletedSurveys(surveyPrefData);

        completed = _.sortBy(completed,['surveyStartData']);

        var nextSurvey = completed.pop();
        return nextSurvey;
    },    

    getAllowedSurveys: function(surveyPrefData) {
        return _.filter(surveyPrefData, function(s) {
            return s.allowedToAsk;
        });
    },

    getActiveSurveys: function(surveyPrefData ) {
        return _.filter(surveyPrefData, function(s) {
            return s.currentIndex != s.lastIndex;
        });
    },

    getCompletedSurveys: function(surveyPrefData ) {
        return _.filter(surveyData, function(s) {
            return s.currentIndex == s.lastIndex;
        });
    },

    decideToSetupSurvey: function(surveyPrefData, callback) {
        var shouldAsk = this.shouldAskQuestion(surveyPrefData);
        if(shouldAsk)
            this.setupSurvey(surveyPrefData,callback);
        else
            callback(null,[]);
    },



    /**
     * [setupSurvey description]
     * @param  Array   surveyPrefData    Data from Survey_Preferences table.
     * @param  {Function} callback             [description]
     * @return SurveyDisplayOptions            Survey Information including the name and range of questions.
     */
    setupSurvey: function( surveyPrefData, callback ) {

        // Take the Survey Preferences
        // Find if we're allowed to ask.
        var allowedSurveys = this.getAllowedSurveys(surveyPrefData);
        var survey = null;

        if( allowedSurveys.length == 1 ) {
            survey = allowedSurveys;
        }
        else if( allowedSurveys.length > 1 ){
            survey = this.selectSurvey(allowedSurveys);
        }

        if( survey ) {
            var opts = SurveyBuilder.setDisplaySurveyOptions(null,null,[survey.currentIndex, survey.lastIndex]);
            callback(null,{"data":survey, options:opts});
        }
        else {
            callback( Errors.cErr( "Unable to select a survey at this time." ) , null);
        }
    }
}