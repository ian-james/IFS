var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentProfile: function( userId, callback ) {
        var q = dbHelpers.buildSelect(config.student_table) + dbHelpers.buildWS("userId");
        db.query(q,userId,callback);
    },

    /**
     * Update student profile as version should exists already.
     * @param {[type]}   userId   [description]
     * @param {[type]}   name     [description]
     * @param {[type]}   bio      [description]
     * @param {[type]}   filename [description]
     * @param {Function} callback [description]
     */
    setStudentProfile: function( userId, name, bio, filename, callback ) {
        var q = dbHelpers.buildUpdate(config.student_table) + " SET name = ?, bio = ?, avatarFileName = ? where userId = ? ";
        db.query(q,[name,bio,filename,userId],callback);
    },
}