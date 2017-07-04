var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    /**
     * Retrieve courses that are available for enrollment
     * Data returned is an array of courses that are enabled on the server
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAllCourses: function(callback) {
        var q = "SELECT * FROM class;";
        db.query(q, callback);
    },

    getCourse: function(code, callback) {
        var q = "SELECT * FROM class WHERE code = ? ;";
        db.query(q, code, callback);
    },

    enrolInCourse: function(userId, classId, callback) {
        var check = dbHelpers.buildSelect(config.student_class_table, "studentId, classId") +  dbHelpers.buildWhere(["studentId", "classId"]);
        db.query(check, [userId, classId], function(err, ret) {
            // if the course is already enrolled, don't do anything
            if (ret.length > 0) {
                callback(err, ret);
            }
            // otherwise, update database
            else {
                console.log("RET", ret);
                var q = dbHelpers.buildInsert(config.student_class_table) + "(studentId, classId) VALUES (?, ?);";
                db.query(q, [userId, classId], callback);
            }
        });
    },

    unenrolFromCourse: function(userId, classId, callback) {
        var q = dbHelpers.buildDelete(config.student_class_table) + dbHelpers.buildWhere(["studentId", "classId"]);
        db.query(q, [userId, classId], callback);
    }
}
