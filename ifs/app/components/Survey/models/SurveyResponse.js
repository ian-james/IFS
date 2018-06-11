/**
 * This is CRUD calls for surveys responses
 */
var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");


function insertSurveyResponse( surveyResponseData, callback ) {
    var req = "INSERT INTO " + dbcfg.survey_results_table + " (userId, surveyId,  questionId, questionAnswer, surveyResponseId ) values (?,?,?,?,?)";
    db.query(req, surveyResponseData, callback);
}

module.exports.insertSurveyResponse = insertSurveyResponse;
