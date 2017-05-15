/* Helper functions to retrieve feedback events */
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    /************************ Feedback Event *******************************************/
    getCountTotalFeedbackItems: function( userId ){
        return {
            'name': "totalFeedbackCount",
            'data':[userId, "submission","feedback"],
            'request': "select userId, COUNT(*) as value from userInteractions where userId = ? and eventType = ? and name= ? ORDER BY userId desc LIMIT 1"
        };
    },

    getMeanFeedbackPerSubmission: function( userId ){
        return {
            'name': "totalFeedbackCount",
            'data':[userId, "submission","feedback",userId, "submission","received"],
            'request':"select ((select COUNT(*) as feedbackItems from userInteractions where userId = ? and eventType = ? and name = ?) / (select COUNT(*) as submissions from userInteractions where userId = ? and eventType = ? and name = ?)) as value"
        };
    },

    getCountFeedbackViews: function( userId ) {
        return {
            'name': "countFeedbackViews",
            'data':[userId, "view", "feedback"],
            'request':"select COUNT(*) as value from userInteractions where userId = ? eventType = ? and name = ?"
        };
    }
};