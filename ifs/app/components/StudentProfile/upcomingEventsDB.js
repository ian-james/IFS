var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentUpcomingEvents: function( userId, callback ) {
        var q = "select e.* from student s, student_class sc, upcoming_event e where s.id = sc.studentId and sc.classId = e.classId and s.userId = ?";
        db.query(q,userId,callback);
    },

    getCourseUpcomingEvents: function( classId , callback ) {
        var q = "select *  from upcoming_event where classId = ?";
        db.query(q,classId,callback);
    }
}