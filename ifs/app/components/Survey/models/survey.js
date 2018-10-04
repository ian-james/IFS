/**
 * This is CRUD calls for surveys
 */
const path = require('path');
const componentPath = path.join(__components, "Survey");
var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
const SurveyBuilder = require(path.join(componentPath, "helpers/surveyBuilder"));
var dbHelpers = require(__components + "Databases/dbHelpers");

function getSurveys( callback ) {
    var q = dbHelpers.buildSelect(dbcfg.survey_table);
    db.query(q,[],callback );
 }

function getSurvey( surveyName, callback ) {
    var q =  dbHelpers.buildSelect(dbcfg.survey_table) + dbHelpers.buildWS("surveyName");
    db.query(q,surveyName, callback);
}

function getSurveyId( surveyId, callback ) {
    var q = dbHelpers.buildSelect(dbcfg.survey_table) + dbHelpers.buildWS("id");
    db.query(q,surveyId, callback);
}

function getSurveyByTitle( surveyTitle, callback ) {
    let q = 'select survey.*, (select COUNT(*) from questions where questions.surveyId=survey.id) as numQ from survey where survey.title = ?;';
    db.query(q, surveyTitle, callback);
}

function insertSurvey( surveyData, callback ) {
    var q = dbHelpers.buildInsert(dbcfg.survey_table) + dbHelpers.buildValues( ["surveyName", "authorNames", "title", "totalQuestions", "surveyField", "surveyFreq","fullSurveyFile"] );
    db.query(q, surveyData, callback);
}

function updateSurvey( surveyData, callback ) {
    var q = dbHelpers.buildUpdate(dbcfg.survey_table) + dbHelpers.buildWhere( ["surveyData", "authorNames", "title", "fullSurveyFile"] );
    db.query(q,[surveyData], callback);
}

function deleteSurvey( surveyData, callback ) {
    var q = dbHelpers.buildDelete(dbcfg.survey_table)  + dbHelpers.buildWS("surveyName");
    db.query(q,surveyData, callback );
}


module.exports.insertSurvey = insertSurvey;
module.exports.deleteSurvey = deleteSurvey;
module.exports.getSurvey = getSurvey;
module.exports.getSurveyId = getSurveyId;
module.exports.getSurveys = getSurveys;
module.exports.getSurveyByTitle = getSurveyByTitle;