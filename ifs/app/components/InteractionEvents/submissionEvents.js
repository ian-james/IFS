var dbcfg = require(__configs + 'databaseConfig');
var eventDB = require(__components + "InteractionEvents/event.js" );
var dbHelpers = require(__components + "Databases/dbHelpers.js");

module.exports = {

    addSubmission: function ( submissionData, callback) {
        dbHelpers.insertEventC(dbcfg.submission_table, submissionData ,callback);
    },

    getLastSubmissionId: function(userId, sessionId ){
        return {
            "name": 'lastSubmissionNumber',
            "data": [ userId,sessionId ],
            "request": "select id as value from " + dbcfg.submission_table +  " where userId = ? and sessionId = sessionId ORDER BY id desc LIMIT 1"
        };
    },

    getSubmissionNumber: function( userId ) {
        return {
            "name": 'submissionNumber',
            "data": [ userId ],
            "request": "select COUNT(*) as value from " + dbcfg.submission_table +  " where userId = ? "
        };
    },

    /************************ Submission Event *******************************************/
    getAllSubmissions: function( userId ){
        return {
            'name': "allSubmissions",
            'data':[userId],
            'request': "select COUNT(*) as value from "  + dbcfg.submission_table +  " where userId = ?"
        };
    },

    getTotalSubmissionsCount: function( userId ){
        return {
            'name': "totalSubmissions",
            'data':[userId, "submission", "received"],
            'request': "select COUNT(*) as value from "  + dbcfg.submission_table +  " where userId = ?"
        };
    },

    getSessionSubmissionsCount: function( userId, sessionId ){
        return {
            'name': "countSessionSubmissions",
            'data':[userId, sessionId],
            'request': "select COUNT(*) as value from "  + dbcfg.submission_table +  " where userId = ? and sessionId = ?"
        };
    },

    // TODO: TEST and USE
    getSubmissions: function( userId ){
        return {
            'name': "submissions",
            'data':[userId, "submission", "received"],
            'request': "select userId,date from "  + dbcfg.submission_table +  " where userId = ? and eventType = ? and name=?"
        };
    },

    getMostRecentSubmission: function( userId ){
        return {
            'name': "mostRecentSubmission",
            'data':[userId],
            'request': "select userId,date as value from "  + dbcfg.submission_table +  " where userId = ? ORDER BY date desc LIMIT 1"
        };
    },

    // TODO: TEST and USE
    getSessionSubmissions: function( userId, sessionId ){
        return {
            'name': "sessionSubmissions",
            'data':[userId, sessionId, "submission", "received"],
            'request': "select userId,date from "  + dbcfg.submission_table +  " where userId = ? and sessionId = ?"
        };
    },
    
    getDailySubmission: function( userId ){
        return {
            'name': "dailySubmissions",
            'data':[userId],
            'request': "select userId, COUNT(*) as value  from "  + dbcfg.submission_table +  " where userId = ? and Date(date) = Date(NOW()) GROUP By date"
        };
    },

    getWeeklySubmission: function( userId ){
        return {
            'name': "weeklySubmissions",
            'data':[userId],
            'request': "select userId, COUNT(*) as value  from "  + dbcfg.submission_table +  " where userId = ? and date >= Date(NOW()) - INTERVAL 7 DAY"
        };
    },

    getTimeBetweenMostRecentSubmissions: function( userId ) {
        return {
            'name': "timediffLastSubmissions",
            'data':[userId],
            'request': "select timediff(MAX(a.date),MIN(a.date)) as value from (SELECT DISTINCT date from submission  where userId = ? ORDER BY date desc limit 0,2) a"
        };
    },
    
    getMostFeedbackPerSubmission: function( userId ) {
        return {
            'name': "mostFeedbackPerSubmission",
            'data':[userId],
            'request': "select MAX(a.subFeedback) as value from (select COUNT(*) as subFeedback from feedback where userId = ? GROUP BY submissionId) a"
        };
    },

     getMeanFeedbackPerSubmission: function( userId ) {
        return {
            'name': "meanFeedbackPerSubmission",
            'data':[userId],
            'request': "select AVG(a.subFeedback) as value from (select COUNT(*) as subFeedback from feedback where userId = ? GROUP BY submissionId) a"
        };
    }
}