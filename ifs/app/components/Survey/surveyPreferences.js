/**
 * This is CRUD calls for surveys
 */
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var moment = require('moment');

function insertSurveyPrefs( surveyPrefData, callback ) {
    var req = "INSERT INTO " + config.survey_preferences_table + " (surveyId,userId,lastRevision,lastIndex) values (?,?,?,?)";
    db.query(req, surveyPrefData, function(err,data){
        callback(err,data);
    });
}

function setQuestionCounter( userId, surveyId, questionIndex, callback ) {
    var d = moment( new Date()).format("YYYY-MM-DD HH:mm:ss");
    var req = "Update " + config.survey_preferences_table  + " set lastRevision = ?, currentIndex = ? where surveyId = ? and userId = ?";
    db.query(req, [d,questionIndex, userId,surveyId], function(err,data){
        callback(err,data);
    });
}

function incrementSurveyIndex( userId, surveyId, callback ) {
    var d = moment( new Date()).format("YYYY-MM-DD HH:mm:ss");
    var req = "Update " + config.survey_preferences_table  + " set lastRevision = ?, set currentSurveyIndex = currentSurveyIndex+1  where surveyId = ? and userId = ?";
    db.query(req, [d,userId,surveyId], function(err,data){
        callback(err,data);
    });
}

function getSurveyPreferences( surveyId, userId, callback ) {
    var req = "SELECT * FROM " + config.survey_preferences_table + " WHERE surveyId = ? and userId = ?";
    db.query(req, [surveyId, userId], callback);
}

module.exports = {
    setQuestionCounter: setQuestionCounter,
    insertSurveyPrefs : insertSurveyPrefs,
    getSurveyPreferences : getSurveyPreferences,
    incrementSurveyIndex : incrementSurveyIndex
};
