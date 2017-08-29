/* Helper functions to retrieve feedback events */
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getCountFeedbackViews: function( userId ) {
        return {
            'name': "countFeedbackViews",
            'data':[userId, "view", "feedback"],
            'request':"select COUNT(*) as value from user_interactions where userId = ? eventType = ? and name = ?"
        };
    },
}