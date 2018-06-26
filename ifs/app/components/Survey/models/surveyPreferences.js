/**
 * This is CRUD calls for surveys
 */
var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var moment = require('moment');

function insertSurveyPrefs( surveyPrefData, callback ) {
    var req = "INSERT INTO " + dbcfg.survey_preferences_table + " (userId, surveyId,lastRevision,lastIndex) values (?,?,?,?)";
    db.query(req, surveyPrefData, function(err,data){
        callback(err,data);
    });
}

function setQuestionCounter( userId, surveyId, questionIndex, callback ) {
    var d = moment( new Date()).format("YYYY-MM-DD HH:mm:ss");
    var req = "Update " + dbcfg.survey_preferences_table  + " set lastRevision = ?, currentIndex = ? where userId = ? and surveyId = ? ";
    db.query(req, [d,questionIndex, userId,surveyId], function(err,data){
        callback(err,data);
    });
}

function incrementSurveyIndex( userId, surveyId, callback ) {
    var d = moment( new Date()).format("YYYY-MM-DD HH:mm:ss");
    var req = "Update " + dbcfg.survey_preferences_table  + " set lastRevision = ?, currentSurveyIndex = currentSurveyIndex+1  where  userId = ? and surveyId = ?";
    db.query(req, [d,userId,surveyId], function(err,data){
        callback(err,data);
    });
}

function getSurveyPreferences(  userId, surveyId, callback ) {
    var req = "SELECT * FROM " + dbcfg.survey_preferences_table + " WHERE userId = ? and surveyId = ?";
    db.query(req, [ userId, surveyId], callback);
}

module.exports = {
    setQuestionCounter: setQuestionCounter,
    insertSurveyPrefs : insertSurveyPrefs,
    getSurveyPreferences : getSurveyPreferences,
    incrementSurveyIndex : incrementSurveyIndex
};
