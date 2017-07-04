var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    /**
     * Retrieve courses that are available for enrollment
     * Data returned is an array of courses that are enabled on the server
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     **/
    getAllCourses: function(callback) {
        var q = "SELECT * FROM class;";
        db.query(q, callback);
    },

    /**
     * Lookup a course by course-code
     * Data returned is the matching row from the class table
     * @param  {string}   code     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     **/
    getCourse: function(code, callback) {
        var q = "SELECT * FROM class WHERE code = ? ;";
        db.query(q, code, callback);
    },

    /**
     * Enrol a student in a course by classId if not already enrolled
     * Data returned is sql status for the insertion
     * @param  {integer}  userId   [description]
     * @param  {integer}  classId  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     **/
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

    /**
     * Unenrol a student in a course by classId
     * Data returned is sql status for the deletion
     * @param  {integer}  userId   [description]
     * @param  {integer}  classId  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     **/
    unenrolFromCourse: function(userId, classId, callback) {
        var q = dbHelpers.buildDelete(config.student_class_table) + dbHelpers.buildWhere(["studentId", "classId"]);
        db.query(q, [userId, classId], callback);
    }
}
