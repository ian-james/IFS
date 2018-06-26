var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    
    getTotalSurveyQuestionsAnswered: function( userId  ){
        return {
            'name': "totalSurveyQuestionsAnswered",
            'data':[userId],
            'request': "select count(id) as value from survey_results where userId = ?"
        };
    },

    getTotalSurveysCompleted: function( userId ) {
        return {
            'name': "totalSurveySurveysAnswered",
            'data':[userId],
            'request': "select sum(currentSurveyIndex) as value from survey_preferences where userId = ?"
        };
    },

};