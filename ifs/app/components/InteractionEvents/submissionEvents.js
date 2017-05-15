var config = require(__configs + 'databaseConfig');
var eventDB = require(__components + "InteractionEvents/event.js" );
var dbHelpers = require(__components + "Databases/dbHelpers.js");

module.exports = {

    addSubmission: function ( submissionData, callback) {
        dbHelpers.insertEventC(config.submission_table, submissionData ,callback);
    },

    getSubmissionNumber: function( userId ) {
        return {
            "name": 'submissionNumber',
            "data": [ userId ],
            "request": "select COUNT(*) as value from " + config.submission_table +  " where userId = ? "
        };
    },

    /************************ Submission Event *******************************************/
    getAllSubmissions: function( userId ){
        return {
            'name': "allSubmissions",
            'data':[userId,"submission", "received"],
            'request': "select userId,eventType,name, COUNT(*) as value from userInteractions where userId = ? and eventType = ? and name = ?"
        };
    },

    getTotalSubmissionsCount: function( userId ){
        return {
            'name': "totalSubmissions",
            'data':[userId, "submission", "received"],
            'request': "select userId,eventType,name, COUNT(*) as value from userInteractions where userId = ? and eventType = ? and name = ?"
        };
    },

    getSessionSubmissionsCount: function( userId, sessionId ){
        return {
            'name': "countSessionSubmissions",
            'data':[userId, sessionId, "submission", "received"],
            'request': "select userId,eventType,name, COUNT(*) as value from userInteractions where userId = ? and sessionId = ? and eventType = ? and name = ?"
        };
    },

    getSubmissions: function( userId ){
        return {
            'name': "submissions",
            'data':[userId, "submission", "received"],
            'request': "select userId,eventType,name,date from userInteractions where userId = ? and eventType = ? and name=?"
        };
    },

    getMostRecentSubmission: function( userId ){
        return {
            'name': "mostRecentSubmission",
            'data':[userId, "submission", "received"],
            'request': "select userId,eventType,name,date as value from userInteractions where userId = ?  and eventType = ? and name= ? ORDER BY date desc LIMIT 1"
        };
    },

    getSessionSubmissions: function( userId, sessionId ){
        return {
            'name': "sessionSubmissions",
            'data':[userId, sessionId, "submission", "received"],
            'request': "select userId,eventType,name,date from userInteractions where userId = ? and sessionId = ? and eventType = ? and name=?"
        };
    },
    
    getDailySubmission: function( userId ){
        return {
            'name': "dailySubmissions",
            'data':[userId, "submission", "received"],
            'request': "select userId, eventType, name,date, COUNT(*) as value  from userInteractions where userId = ?  and eventType = ? and name = ? and Date(date) = Date(NOW()) GROUP By date"
        };
    },

}