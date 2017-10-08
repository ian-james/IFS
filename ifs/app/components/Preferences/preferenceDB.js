var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    /**
     * Returns an array of student preferences,
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getStudentPreferences: function( userId, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.preferences_table, "toolName,toolValue") + dbHelpers.buildWS("userId");
        db.query(q,userId,callback);
    },

    /**
     * Get a single tool and value for a student.
     * @param  {[type]}   userId   [description]
     * @param  {[type]}   toolname [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getStudentPreferencesByToolName: function( userId, toolName, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.preferences_table, "toolName,toolValue") +  dbHelpers.buildWhere(["userId", "toolName"]);
        db.query(q,[userId,toolName],callback);
    },

    /**
     * Tool Type is either programming, visual or writing
     * @param  {[type]}   userId   [description]
     * @param  {[type]}   toolType [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getStudentPreferencesByToolType: function( userId, toolType, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.preferences_table, "toolName,toolValue") +  dbHelpers.buildWhere(["userId", "toolType"]);
        db.query(q,[userId,toolType],callback);
    },


    setStudentPreferences: function(userId, toolType, toolName, toolValue, callback ) {
        var q = dbHelpers.buildInsert(dbcfg.preferences_table) + dbHelpers.buildValues(["userId","toolType", "toolName","toolValue"]) +
                " ON DUPLICATE KEY UPDATE toolValue = ?";
        db.query(q,[userId,toolType, toolName, toolValue, toolValue], callback);
    },

    /**
     * This function clears tool form preferences from DB
     * Used to clear and reinsert since form data doesn't cover both on/off for most tools.
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    clearStudentFormPreferences: function( userId, toolType, callback ) {
        var q = dbHelpers.buildDelete(dbcfg.preferences_table) + " where userId = ? and toolType = ? and  (toolName LIKE 'opt-%' or toolName LIKE 'enabled-%')";
        db.query(q,[userId,toolType], callback);
    },
}
