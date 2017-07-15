/**
 * This is CRUD calls for surveys
 */
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

var dbHelpers = require(__components + "Databases/dbHelpers");

function getSurveys( callback ) {
    var q = dbHelpers.buildSelect(config.survey_table);    
    db.query(q,[],callback );
 }

function getSurvey( surveyName, callback ) {
    var q =  dbHelpers.buildSelect(config.survey_table) + dbHelpers.buildWS("surveyName"); 
    db.query(q,surveyName, callback);
}

function getSurveyId( surveyId, callback ) {

    var q = dbHelpers.buildSelect(config.survey_table) + dbHelpers.buildWS("id"); 
    db.query(q,surveyId, callback);
}

function getSurveyByTitle( surveyTitle, callback ) {
    var q = dbHelpers.buildSelect(config.survey_table) + dbHelpers.buildWS("title"); 
    db.query(q, surveyTitle, callback);
}

function insertSurvey( surveyData, callback ) {
    var q = dbHelpers.buildInsert(config.survey_table) + dbHelpers.buildValues( ["surveyName", "authorNames", "title", "totalQuestions", "surveyField", "surveyFreq","fullSurveyFile"] );
    db.query(q, surveyData, callback);
}

function updateSurvey( surveyData, callback ) {
    var q = dbHelpers.buildUpdate(config.survey_table) + dbHelpers.buildWhere( ["surveyData", "authorNames", "title", "fullSurveyFile"] );
    db.query(q,[surveyData], callback);
}

function deleteSurvey( surveyData, callback ) {
    var q = dbHelpers.buildDelete(config.survey_table)  + dbHelpers.buildWS("surveyName"); 
    db.query(q,surveyData, callback );
}

module.exports.insertSurvey = insertSurvey;
module.exports.deleteSurvey = deleteSurvey;
module.exports.getSurvey = getSurvey;
module.exports.getSurveyId = getSurveyId;
module.exports.getSurveys = getSurveys;
module.exports.getSurveyByTitle = getSurveyByTitle;