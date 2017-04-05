/**
 * This is CRUD calls for surveys
 */
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");


function insertSurveyPrefs( surveyPrefData, callback ) {
    var req = "INSERT INTO " + config.survey_preferences_table + " (surveyId,userId,lastRevision,lastIndex) values (?,?,?,?)";
    db.query(req, surveyPrefData, function(err,data){
        callback(err,data);
    });
}

module.exports.insertSurveyPrefs = insertSurveyPrefs;
