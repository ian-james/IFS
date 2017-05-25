module.exports = {
    /************************ Feedback Event *******************************************/
    getCountFeedbackItems: function( userId ){
        return {
            'name': "totalFeedbackCount",
            'data':[userId],
            'request': "select userId, COUNT(*) as value from feedback where userId = ?"
        };
    },

    getFeedbackPerTool: function( userId, toolName ){
        return {
            'name': "totalFeedbackPerTool",
            'data':[userId, toolName],
            'request': "select COUNT(*) as value from feedback where userId = ? and toolName = ?"
        };
    },

    getMostRecentFeedback: function(userId ){
        return { 
            'name': "mostRecentFeedback",
            'data':[userId],
            'request': "select * from feedback where userId = ? and submissionId = (select MAX(submissionId) from feedback) ORDER BY filename,lineNum,charPos,toolName"
        }
    },

    /* IGNORES visual feedback information */
    getMostRecentFeedbackNonVisual: function(userId ){
        return { 
            'name': "mostRecentFeedbackNonVisual",
            'data':[userId],
            'request': "select * from feedback where userId = ? and runType in (\"writing\",\"programming\") and submissionId = (select MAX(submissionId) from feedback) ORDER BY filename,lineNum,charPos,toolName"
        }
    },

    getMostRecentFeedbackPerTool: function(userId, toolName ){
         return { 
            'name': "mostRecentFeedbackPerTool",
            'data':[userId,toolName],
            'request': "select * from feedback where userId = ? and toolName = ? and submissionId = (select MAX(submissionId) from feedback) ORDER BY filename,lineNum,charPos, toolName"
        }
    },

    getCountFeedbackViews: function( userId ) {
        return {
            'name': "countFeedbackViews",
            'data':[userId, "view", "feedback"],
            'request':"select COUNT(*) as value from userInteractions where userId = ? eventType = ? and name = ?"
        };
    },

    getFeedbackCountPerTool: function( userId ) {
        return {
            'name': "toolsFeedbackCount",
            'data':[userId],
            'request':"select toolName, COUNT(*) from feedback where userId = ? GROUP BY toolName"
        };
    },

    getMeanFeedbackPerTool: function( userId ) {
        return {
            'name': "meanFeedbackPerTool",
            'data':[userId],
            'request': "select AVG(a.val) as value  from ( select COUNT(*) as val from feedback where userId = ? GROUP BY toolName) a"
        };
    },

    getCountMostFeedback: function( userId ) {
        return {
            'name': "countMostFeedback",
            'data':[userId],
            'request':"select val as value from ( select toolName, COUNT(*) as val from feedback where  userId = ? GROUP BY toolName) a ORDER BY a.val desc LIMIT 1"
        };
    },

    getCountLeastFeedback: function( userId ) {
        return {
            'name': "countLeastFeedback",
            'data':[userId],
            'request':"select val as value from ( select toolName, COUNT(*) as val from feedback where  userId = ? GROUP BY toolName) a ORDER BY a.val LIMIT 1"
        };
    },

    getToolWithMostFeedback: function( userId ) {
        return {
            'name': "mostFeedbackTool",
            'data':[userId],
            'request':"select toolName as value from ( select toolName, COUNT(*) as val from feedback where  userId = ? GROUP BY toolName) a ORDER BY a.val desc LIMIT 1"
        };
    },

    getToolWithLeastFeedback: function( userId ) {
        return {
            'name': "leastFeedbackTool",
            'data':[userId],
            'request':"select toolName as value from ( select toolName, COUNT(*) as val from feedback where  userId = ? GROUP BY toolName) a ORDER BY a.val LIMIT 1"
        };
    },

     getMostCommonFeedbackType: function( userId ) {
        return {
            'name': "mostCommonFeedbackType",
            'data':[userId],
            'request':"select type as value from ( select type, COUNT(*) as val from feedback where  userId = ? GROUP BY type) a ORDER BY a.val desc LIMIT 1"
        };
    },

    getLeastCommonFeedbackType: function( userId ) {
        return {
            'name': "leastCommonFeedbackType",
            'data':[userId],
            'request':"select type as value from ( select type, COUNT(*) as val from feedback where  userId = ? GROUP BY type) a ORDER BY a.val LIMIT 1"
        };
    }
};