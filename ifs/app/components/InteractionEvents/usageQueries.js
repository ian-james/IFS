/**
 * THis creates a long list of data read from database.
 * Consider it for a admin page.
 */

// Event DB requests
var sessionDB = require(__components + "InteractionEvents/event.js" );
var pageDB = require(__components + "InteractionEvents/event.js" );
var submissionDB = require(__components + "InteractionEvents/event.js" );
var prefDB = require(__components + "InteractionEvents/event.js" );
var feedbackDB = require(__components + "InteractionEvents/event.js" );
var surveyDB = require(__components + "InteractionEvents/event.js" );

module.exports = {

    studentModelQueries: function (req) {

        return [
            sessionDB.getSessionStart(req.user.id),
            sessionDB.getLastSession(req.user.id, req.user.sessionId ),
            sessionDB.getSessionLength(req.user.id, req.user.sessionId ),
            sessionDB.getSessionsThisWeek(req.user.id),
            //sessionDB.getConsecutiveDays(req.userId),
            sessionDB.getCountDaysLoggedInThisWeek(req.user.id),
            sessionDB.getTotalSessions(req.user.id),
            sessionDB.getMaxSessionsPerDay(req.user.id),
            sessionDB.getMaxSessionsToday(req.user.id),

            pageDB.getPageViews(req.user.id),
            pageDB.getFavPage(req.user.id),

            submissionDB.getTotalSubmissionsCount(req.user.id),
            submissionDB.getMostRecentSubmission(req.user.id),
            submissionDB.getSessionSubmissionsCount(req.user.id, req.user.sessionId),
            submissionDB.getDailySubmission(req.user.id),

            prefDB.getPreferenceChanges(req.user.id),

            feedbackDB.getCountTotalFeedbackItems(req.user.id),
            feedbackDB.getMeanFeedbackPerSubmission(req.user.id)
        ];
    }
};
