/**
 * This is CRUD calls for surveys responses
 */
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");


function insertSurveyResponse( surveyResponseData, callback ) {
    var req = "INSERT INTO " + config.survey_results_table + " (surveyId, userId, questionId, questionAnswer, surveyResponseId ) values (?,?,?,?,?)";
    db.query(req, surveyResponseData, callback);
}

module.exports.insertSurveyResponse = insertSurveyResponse;
