var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require( __configs + "loggingConfig");
var _ = require('lodash');

var eventDB = require(__components + "InteractionEvents/event.js" );
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

        studentModelQueries: function (req) {

            return [
                eventDB.getSessionStart(req.user.id),
                eventDB.getLastSession(req.user.id, req.user.sessionId ),
                eventDB.getSessionLength(req.user.id, req.user.sessionId ),
                eventDB.getSessionsThisWeek(req.user.id),
                //eventDB.getConsecutiveDays(req.userId),
                eventDB.getCountDaysLoggedInThisWeek(req.user.id),
                eventDB.getTotalSessions(req.user.id),
                eventDB.getMaxSessionsPerDay(req.user.id),
                eventDB.getMaxSessionsToday(req.user.id),

                eventDB.getPageViews(req.user.id),
                eventDB.getFavPage(req.user.id),

                eventDB.getTotalSubmissionsCount(req.user.id),
                eventDB.getMostRecentSubmission(req.user.id),
                eventDB.getSessionSubmissionsCount(req.user.id, req.user.sessionId),
                eventDB.getDailySubmission(req.user.id),

                eventDB.getPreferenceChanges(req.user.id),

                eventDB.getCountTotalFeedbackItems(req.user.id),
                eventDB.getMeanFeedbackPerSubmission(req.user.id)
            ];
        }
};
