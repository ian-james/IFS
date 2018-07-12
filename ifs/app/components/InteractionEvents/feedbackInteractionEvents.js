/**
 * TODO:
 *
 * EXTRA:
 *     FIXED VS VIEWEd
 *     FEEDBACK RATE
 *     FEEDBACK COMMITTED
 *
 */

module.exports = {

    getTotalSinglePageViews: function( userId, pageName) {
        return {
            'name': "feedbackViewedThisSession",
            'data':[userId, pageName],
            'request': "select * from user_interactions where eventType=\"view\" and name=\"page\" and data= ? and userId = ?"            
        };
    },

    getTotalFeedbackViewed: function( userId  ){
        return {
            'name': "feedbackViewedThisSession",
            'data':[userId, "viewed"],
            'request': "select COUNT(*) as value from feedback_interactions where userId = ? and action = ? "
        };
    },

    getTotalFeedbackViewedMore: function( userId  ){
        return {
            'name': "feedbackViewedThisSession",
            'data':[userId, "viewedMore"],
            'request': "select COUNT(*) as value from feedback_interactions where userId = ? and action = ? "
        };
    },

    getFeedbackViewedThisSession: function( userId ,sessionId ){
        return {
            'name': "feedbackViewedThisSession",
            'data':[userId,sessionId, "viewed"],
            'request': "select COUNT(*) as value from feedback_interactions where userId = ? and sessionId = ? and action = ? "
        };
    },

    getFeedbackViewedThisSubmission: function( userId , sessionId ){
        return {
            'name': "feedbackViewedThisSubmission",
            'data':[userId, sessionId, "viewed", userId],
            'request': "select COUNT(*) as value from feedback_interactions where userId = ? and sessionId = ? and action = ? and submissionId = ( select MAX(submissionId) from feedback where userId = ? ) "
        };
    },

    getFeedbackViewedMoreThisSession: function( userId ,sessionId ){
        return {
            'name': "feedbackViewedMoreThisSession",
            'data':[userId,sessionId, "viewedMore"],
            'request': "select COUNT(*) as value from feedback_interactions where userId = ? and sessionId = ? and action = ? "
        };
    },

    getFeedbackViewedMoreThisSubmission: function( userId , sessionId ){
        return {
            'name': "feedbackViewedMoreThisSubmission",
            'data':[userId, sessionId, "viewedMore", userId],
            'request': "select COUNT(*) as value from feedback_interactions where userId = ? and sessionId = ? and action = ? and submissionId = ( select MAX(submissionId) from feedback where userId = ? ) "
        };
    },

    getFeedbackToViewedRatio: function( userId , sessionId ){
        return {
            'name': "feedbackViewedToViewedRatio",
            'data':["viewedMore", "viewed", userId, sessionId],
            'request': "select ( sum(case when a.action = ? then 1 else 0 end) / sum(case when a.action = ? then 1 else 0 end )) as value from (select f.userId, f.sessionId, f.feedback, f_i.action from feedback f INNER JOIN feedback_interactions f_i on f.id = f_i.feedbackId where f.userId = ? and f.sessionId = ?) a"
        };
    },

    getFeedbackPerTool: function( userId, sessionId ) {
        return {
            'name': "feedbackViewedToViewedRatio",
            'data':[ userId, sessionId ],
            'request': "select DISTINCT a.toolName, COUNT(a.toolName) from (select f.userId, f.sessionId, f.feedback, f.toolName, f_i.action from feedback f INNER JOIN feedback_interactions f_i on f.id = f_i.feedbackId where f.userId = ? and f.sessionId = ? and f_i.submissionId = ?) a GROUP BY toolName"
        };
    },

    getToolWithMostViewedFeedback: function( userId, sessionId ) {
        return {
            'name': "toolWithMostViewedFeedback",
            'data':[ userId, sessionId ],
            'request': "select DISTINCT a.toolName, COUNT(a.toolName) from (select f.userId, f.sessionId, f.feedback, f.toolName, f_i.action from feedback f INNER JOIN feedback_interactions f_i on f.id = f_i.feedbackId where f.userId = ? and f.sessionId = ? and f_i.submissionId = ?) a GROUP BY toolName ORDER BY COUNT(a.toolName) desc LIMIT 1"
        };
    },
};