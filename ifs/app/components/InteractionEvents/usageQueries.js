/**
 * THis creates a long list of data read from database.
 * Consider it for a admin page.
 */

// Event DB requests
var sessionDB = require(__components + "InteractionEvents/sessionEvents.js" );
var pageDB = require(__components + "InteractionEvents/pageEvents.js" );
var submissionDB = require(__components + "InteractionEvents/submissionEvents.js" );
var prefDB = require(__components + "InteractionEvents/preferenceEvents.js" );
var feedbackDB = require(__components + "InteractionEvents/feedbackEvents.js" );
var surveyDB = require(__components + "InteractionEvents/surveyEvents.js" );

module.exports = {

    getAllQueries: function(req) {
        var arr = [];
        return arr.concat( 
            this.getSessionQueries(req),
            this.getNavigationQueries(req),
            this.getSubmissionQueries(req),
            this.getPreferenceQueries(req),
            this.getFeedbackQueries(req),
            this.getFeedbackInteractionQueries(req),
            this.getToolQueries(req),
            this.getSurveyQueries(req)
        );
    },

    getSessionQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            sessionDB.getSessionStart(id),
            sessionDB.getLastSession(id, sessionId ),
            sessionDB.getSessionLength(id, sessionId ),
            sessionDB.getSessionsThisWeek(id),
            //sessionDB.getConsecutiveDays(req.userId),
            sessionDB.getCountDaysLoggedInThisWeek(id),
            sessionDB.getTotalSessions(id),
            sessionDB.getMaxSessionsPerDay(id),
            sessionDB.getMaxSessionsToday(id)
        ];
    },

    getNavigationQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            pageDB.getPageViews(id),
            pageDB.getFavPage(id)
        ];
    },

    getSubmissionQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            submissionDB.getTotalSubmissionsCount(id),
            submissionDB.getMostRecentSubmission(id),
            submissionDB.getSessionSubmissionsCount(id, sessionId),
            submissionDB.getDailySubmission(id),
            submissionDB.getWeeklySubmission(id),
            submissionDB.getTimeBetweenMostRecentSubmissions(id),
            submissionDB.getMostFeedbackPerSubmission(id),
            submissionDB.getMeanFeedbackPerSubmission(id)
        ];
    },

    getPreferenceQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            prefDB.getPreferenceChanges(id)
        ];
    },

    getFeedbackQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            feedbackDB.getCountFeedbackItems(id),
            feedbackDB.getMeanFeedbackPerSubmission(id),
            feedbackDB.getToolWithMostFeedback(id),
            feedbackDB.getToolWithLeastFeedback(id),
            feedbackDB.getCountMostFeedback(id),
            feedbackDB.getCountLeastFeedback(id),
            feedbackDB.getMeanFeedbackPerTool(id),
            feedbackDB.getMostCommonFeedbackType(id),
            feedbackDB.getLeastCommonFeedbackType(id),
        ];
    },

    /** Information about what the user interacted with  */
    getFeedbackInteractionQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            // TODO:JF
        ];
    },
    
    /** Information about what the user interacted with  */
    getToolQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            // TODO:JF
        ];
    },

    /** Information about what the user interacted with  */
    getSurveyQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            // TODO:JF
        ];
    },

    /** Compare information between submissions such as lines changed or files committed */
    getSubmissionComparisonQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            // TODO:JF
        ];
    },

    /** Compare if items viewed reflected, items fixed.  */
    getFeedbackToSubmissionComparisonQueries: function (req) {
        var id = req.user.id;
        var sessionId = req.user.sessionId;

        return [
            // TODO:JF
        ];
    },

    /** View student's interaction with student model information.  */
    getStudentModelQueries: function (req) {

        var id = req.user.id;
        var sessionId = req.user.sessionId;
        return [
            // TODO:JF
        ];
    }
};
