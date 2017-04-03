/**
 * This is CRUD calls for surveys
 */
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

function getSurvey( surveyName, callback ) {

    var req = "SELECT * FROM " + config.survey_table + " WHERE surveyName = ?";
     db.query(req,surveyName, function(err,data){
        console.log(err,data);
        callback(err,data);
    });
}

function insertSurvey( surveyData, callback ) {
    console.log("Surve Table is ", config.survey_table);
    var req = "INSERT INTO " + config.survey_table + " (surveyName, authorNames, title, fullSurveyFile) values (?,?,?,?)";
    db.query(req, surveyData, function(err,data){
        console.log("INSERT TOP");
        callback(err,data);
    });
}

function updateSurvey( surveyData, callback ) {
    var req = "UPDATE " + config.survey_table + " (surveyData, authorNames, title, fullSurveyFile) values (?,?,?,?)";
    db.query(req,[surveyData], function(err,data){
        callback(err,data);
    });
}

function deleteSurvey( surveyData, callback ) {
    var req = " DELETE FROM " + config.survey_table + " WHERE surveyName = ?";
    db.query(req,surveyData, function(err,data){
        callback(err,data);
    });
}

module.exports.insertSurvey = insertSurvey;
module.exports.deleteSurvey = deleteSurvey;
module.exports.getSurvey = getSurvey;