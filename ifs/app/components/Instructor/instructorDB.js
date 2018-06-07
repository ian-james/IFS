/*
    Import the required configuration files and libraries
*/

var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    
    // should be in its own file not here and not in admin
    getRole: function( userId , callback ) {
        var q = "select role value from user_role ur, users u, roles r  where ur.userId = u.id and r.id = ur.roleId and u.id = ?";
        db.query(q,userId,callback);
    },

    isInstructor: function( role ) {
        return role == "instructor";
    },

    /**
     * Get all classes belonging to the instructor in the database.
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getClasses: function(instId, callback) {
        dbHelpers.selectWhere( dbcfg.class_table, "instructorId" , instId, callback);
    }
}