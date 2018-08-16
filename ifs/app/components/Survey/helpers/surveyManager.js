/*
  Survey Manager - decides which questions to ask and when.
 */
var _ = require('lodash');
var async = require('async');
var Logger = require( __configs + "loggingConfig");
//var SurveyMeta = require( __components + 'Survey/SurveyMetaData');

var mysql = require('mysql');
var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

var SurveyBuilder = require( __components + "Survey/helpers/surveyBuilder");

var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    /**
     * Retrieves all preference information for all surveys
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return  Array of survey data from DB.
     */
    getUserSurveyProfile: function( userId, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.survey_preferences_table ) + dbHelpers.buildWS("userId");
        db.query(req,userId,callback);
    },

    /**
     * Retrieve Survey preferences and survey information in one go for a specific user.
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getUserSurveyProfileAndSurveyType: function(userId, callback) {
        var q = "select sp.*, s.id, s.title, s.surveyField,s.surveyFreq, s.totalQuestions from survey_preferences sp, survey s where s.id = sp.surveyId and userId = ?";
        db.query(q,userId,callback);
    },

    setAbleAllSurveyPreferences: function( userId, ableValue, callback ) {
        var q = dbHelpers.buildUpdate(dbcfg.survey_preferences_table) + " set allowedToAsk = ? " + dbHelpers.buildWS("userId")
        db.query(q,[ableValue,userId], callback);
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
        if(surveyPrefData.length == 1)
            return surveyPrefData[0];

        var active = this.organizeSurveyChoices(surveyPrefData);

        if( active.length == 0 ) {
            // Start a new survey
            // Currently just picking the oldest start time
            return this.startNewSurvey(surveyPrefData);
        }
        return active[0];
    },

    /**
     * Organize survey selection options based on last revision data, start date and index.
     * @param  {[type]} surveyPrefData [description]
     * @return {[type]}                [description]
     */
    organizeSurveyChoices: function(surveyPrefData) {
        var prefsOrder = ['lastRevision','surveyStartDate','currentIndex', 'currentSurveyIndex'];
        var active = this.getActiveSurveys(surveyPrefData);
        active = _.orderBy(active,prefsOrder, ["desc","asc","desc", "asc"]);
        return active;
    },

    /**
     * This function searches the completed survey's to restart a new one.
     * [startNewSurvey description]
     * @param  {[type]} surveyPrefData [description]
     * @return {[type]}                [description]
     */
    startNewSurvey: function(surveyPrefData ) {
       var completed = this.getCompletedSurveys(surveyPrefData);
        completed = _.orderBy(completed,['lastRevision'],['desc']);

        var nextSurvey = completed.pop();
        nextSurvey.currentIndex =0;
        return nextSurvey;
    },



    getActiveSurveys: function(surveyPrefData ) {
        return _.filter(surveyPrefData, function(s) {
            return s.currentIndex != s.lastIndex;
        });
    },

    /**
     * Retrieve surveys that have been completed.
     * @param  {[type]} surveyPrefData [description]
     * @return {[type]}                [description]
     */
    getCompletedSurveys: function(surveyPrefData ) {
        return _.filter(surveyPrefData, function(s) {
            return s.currentIndex == s.lastIndex;
        });
    },

    /**
     * Retrieve all survey's in field or general
     * @param  {[type]} surveyPrefData [description]
     * @param  {[type]} currentField   array of field potentials
     * @return {[type]}                [description]
     */
    getSurveyInField: function( surveyPrefData, currentFields) {
        return _.filter(surveyPrefData, function(s) {
            return currentFields.includes(s.surveyField)
        });
    },

    getSurveyInFreq: function( surveyPrefData, currentFields) {
        return _.filter(surveyPrefData, function(s) {
            return currentFields.includes(s.surveyFreq)
        });
    },

    /**
     * [setupSurvey description]
     * @param  Array   surveyPrefData    Data from Survey_Preferences table.
     * @param  {Function} callback             [description]
     * @return SurveyDisplayOptions            Survey Information including the name and range of questions.
     */
    setupSurvey: function( surveyType, surveyPrefData, callback ) {

        // Eliminate surveys we aren't allowed to asked or aren't the right type.
        var surveyOptions = this.getSurveyFieldMatches(surveyPrefData,"surveyField",[surveyType,"general"]);
        surveyOptions = this.getSurveyFieldMatches(surveyOptions,"surveyFreq",["reg"]);
        surveyOptions = this.getAllowedSurveys(surveyOptions);
        var survey = null;

        survey = this.selectSurvey(surveyOptions);

        if( survey  && survey.length != 0) {
            var opts = SurveyBuilder.setDisplaySurveyOptions(null,null,[survey.currentIndex, survey.lastIndex]);
            callback(null,{"data":survey, options:opts});
        }
        else {
            callback( Errors.cErr( "Unable to select a survey at this time." ) , null);
        }
    }
}