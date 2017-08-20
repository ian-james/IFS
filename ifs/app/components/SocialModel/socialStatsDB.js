var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getMostUsedTools: function(runType, nLimit,  callback ) {
        if( runType == "" ) {
            var q = "select toolName, COUNT(*) as value from feedback group by toolName ORDER by value desc LIMIT " + nLimit.toString();
            db.query(q,[],callback);
        }
        else {
            var q = "select toolName, COUNT(*) as value from feedback where runtype = ? group by toolName ORDER by value desc LIMIT " + nLimit.toString();
            db.query(q,[runType],callback);
        }
    },

    getMostCommonSpellingMistakes: function(nLimit, callback ) {
        var q = "select target, suggestions, COUNT(*) as value from feedback where type = 'spelling' group by target,suggestions ORDER by value desc LIMIT " + nLimit.toString();
        db.query(q,[],callback);
    },

    getOthersMostCommonSpellingMistakes: function( userId, nLimit, callback ) {
        var q = "select target, suggestions, COUNT(*) as value from feedback where usersId != ? and type = 'spelling' group by target,suggestions ORDER by value desc LIMIT " + nLimit.toString();
        db.query(q,userId,callback);
    },

    getSpellingAccuracy: function( callback ) {
        var q = "select name,SUM(statValue) as value from feedback_stats where name in(\"correctWordCount\",\"misspelledWordCount\") GROUP BY name";
        db.query(q,[],callback);
    },

    getMostUsedTools: function( runType, nLimit, callback ) {
        var q = "select toolName, COUNT(*) as value from feedback where runType = ? group by toolName ORDER by value desc LIMIT " + nLimit.toString();
        db.query(q,[runType],callback);
    },

    getCommonFeedbackTool: function( runType, nLimit, callback ) {
        var q = "select a.toolName, COUNT(*) as value from ( select fi.userId, fi.action, f.toolName  " +
                "from feedback_interaction fi, feedback f where fi.feedbackId = f.id  and f.runType = ? ) a " +
                "GROUP by a.toolName ORDER BY value desc LIMIT " + nLimit.toString();
        db.query(q,[runType],callback);
    },

    getCommonViewedMoreFeedbackTool: function( runType, nLimit, callback ) {
        var q = "select a.toolName, COUNT(*) as value from ( select fi.userId,fi.action,f.toolName " +
                "from feedback_interaction fi, feedback f where  fi.action = 'viewedMore' and fi.feedbackId = f.id and  f.runType = ? ) a " + 
                "GROUP by a.toolName ORDER BY value desc LIMIT " + nLimit.toString();
        db.query(q,[runType],callback);
    },

    getOtherSubmissionToErrorRate: function( userId, runType, callback) {
        var q =  "select count( distinct(submissionId)) as submissionCount , count(submissionId) as feedbackItems from feedback where userId != ? and runType = ?"
        db.query(q,[userId,runType],callback);
    },

    getSubmissionsPerWeek: function( userId, callback ) {
        var format = "DATE_FORMAT(date, '%Y-%m-%d')";
        var q = dbHelpers.buildSelect( config.submission_table, " COUNT(*) as value, Date_FORMAT(str_to_date(concat(yearweek(date), ' monday'), '%X%V %W')), '%Y-%m-%d') as 'labels' ") + " where userId != ? GROUP BY yearweek(date), labels";
        db.query( q, [userId], callback );
    },

    getSubmissionsPerWeekBetweenDates: function( userId, minDate, maxDate,  callback ) {
        var q = dbHelpers.buildSelect( config.submission_table, " COUNT(*) as value, Date_FORMAT((str_to_date(concat(yearweek(date), ' monday'), '%X%V %W')), '%Y-%m-%d') as 'labels' ") + " where userId != ? and date >= ? and date <= ? GROUP BY yearweek(date), labels ";
        db.query( q, [userId,minDate, maxDate], callback );
    },
}
