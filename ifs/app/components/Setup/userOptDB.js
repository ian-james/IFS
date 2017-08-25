var db = require(__configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    getUserOptIn: function(userId, callback) {
        var q = dbHelpers.buildSelect(dbcfg.users_table, "id, username, optedIn") + dbHelpers.buildWhere(["id"]);
        db.query(q, userId, callback);
    },

    /**
     * Function to toggle a user's decision to opt-in to data collection.
     * @param userId: the id of the current user
     * @param optIn: 0 for FALSE, 1 for TRUE
     * @param callback: callback function
     **/
    toggleOptedIn: function(userId, optIn, callback) {
        var q = "UPDATE " + dbcfg.users_table + " SET optedIn = ? WHERE id = ?;"
        db.query(q, [optIn, userId], callback);
    }
}
