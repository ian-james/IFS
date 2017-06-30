var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentUpcomingEvents: function( userId, callback ) {
        var q = "SELECT e.* FROM student s, student_class sc, upcoming_event e WHERE s.id = sc.studentId AND sc.classId = e.classId AND s.userId = ?";
        db.query(q,userId,callback);
    },

    getCourseUpcomingEvents: function( classId , callback ) {
        var q = "SELECT *  FROM upcoming_event WHERE classId = ?";
        db.query(q,classId,callback);
    }
}
