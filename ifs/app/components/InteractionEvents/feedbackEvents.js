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


    getMostRecentFeedback: function( userId ){
        return {
            'name': "mostRecentFeedback",
            'data':[userId,userId],
            'request': "select * from feedback where userId = ? and submissionId = (select id from submission where userId = ? ORDER By date DESC Limit 1) ORDER BY filename,lineNum,charPos,toolName"
        }
    },

    /* IGNORES visual feedback information */

    getMostRecentFeedbackNonVisual: function( userId ){
        return {
            'name': "mostRecentFeedbackNonVisual",
            'data':[userId,userId],
            'request': "select * from feedback where userId = ? and runType in (\"writing\",\"programming\") and submissionId = (select id from submission where userId = ? ORDER By date DESC Limit 1) ORDER BY filename,lineNum,charPos,toolName"
        }
    },

    /**
     * Get Most recent Feedback Stats
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    getMostRecentFeedbackStats: function( userId ){
        return {
            'name': "mostRecentFeedbackNonVisual",
            'data':[userId,userId],
            'request': "select * from feedback_stats "
                        + " where userId = ? and submissionId = (select id from submission where userId = ? ORDER By date DESC Limit 1) "
                        + " ORDER BY filename,statName"
        }
    },

    getMostRecentFeedbackVisualOnly: function(userId) {
        return {
            'name': "mostRecentFeedbackVisualOnly",
            'data':[userId,userId],
            'request': "select * from feedback where userId = ? and runType in (\"visual\") and submissionId = (select id from submission where userId = ? ORDER By date DESC Limit 1) ORDER BY filename,lineNum,charPos,toolName"
        }
    },

    getMostRecentVisualTools: function( userId ) {
      return {
            'name': "mostRecentFeedbackVisualOnly",
            'data':[userId,userId],
            'request': "select toolName as name, route as route, COUNT(*) from feedback where userId = ? and runType in (\"visual\") and submissionId = (select id from submission where userId = ? order by date desc limit 1) group by toolName, route;"
        }
    },

    getMostRecentFeedbackPerTool: function( userId, toolName ) {
         return {
            'name': "mostRecentFeedbackPerTool",
            'data':[userId,toolName,userId],
            'request': "select * from feedback where userId = ? and toolName = ? and submissionId = (select id from submission where userId = ? ORDER By date DESC Limit 1) ORDER BY filename,lineNum,charPos, toolName"
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

    getToolsWithMostFeedback: function( userId , limitN  = 1) {
        return {
            'name': "topFeedbackTools",
            'data':[userId],
            'request':"select toolName as value from ( select toolName, COUNT(*) as val from feedback where  userId = ? GROUP BY toolName) a ORDER BY a.val desc LIMIT " + limitN.toString()
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

    getMostCommonFeedbackTypes: function( userId, limitN ) {
        return {
            'name': "mostCommonFeedbackType",
            'data':[userId],
            'request':"select type as value from ( select type, COUNT(*) as val from feedback where  userId = ? GROUP BY type) a ORDER BY a.val desc LIMIT " + limitN.toString()
        };
    },


    getLeastCommonFeedbackType: function( userId ) {
        return {
            'name': "leastCommonFeedbackType",
            'data':[userId],
            'request':"select type as value from ( select type, COUNT(*) as val from feedback where  userId = ? GROUP BY type) a ORDER BY a.val LIMIT 1"
        };
    }
}
