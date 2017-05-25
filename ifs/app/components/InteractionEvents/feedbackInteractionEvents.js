module.exports = {
    
    getFeedbackViewedThisSession: function( userId ,sessionId ){
        return {
            'name': "feedbackViewedThisSession",
            'data':[userId,sessionId, "viewed"],
            'request': "select COUNT(*) as value from feedback_interaction where userId = ? and sessionId = ? and action = ? "
        };
    },

    getFeedbackViewedThisSubmission: function( userId , sessionId ){
        return {
            'name': "feedbackViewedThisSubmission",
            'data':[userId, sessionId, "viewed", userId],
            'request': "select COUNT(*) as value from feedback_interaction where userId = ? and sessionId = ? and action = ? and submissionId = ( select MAX(submissionId) from feedback where userId = ? ) "
        };
    },

    getFeedbackViewedMoreThisSession: function( userId ,sessionId ){
        return {
            'name': "feedbackViewedMoreThisSession",
            'data':[userId,sessionId, "viewedMore"],
            'request': "select COUNT(*) as value from feedback_interaction where userId = ? and sessionId = ? and action = ? "
        };
    },

    getFeedbackViewedMoreThisSubmission: function( userId , sessionId ){
        return {
            'name': "feedbackViewedMoreThisSubmission",
            'data':[userId, sessionId, "viewedMore", userId],
            'request': "select COUNT(*) as value from feedback_interaction where userId = ? and sessionId = ? and action = ? and submissionId = ( select MAX(submissionId) from feedback where userId = ? ) "
        };
    }
};