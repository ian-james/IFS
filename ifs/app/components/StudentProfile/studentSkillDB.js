var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentSkills: function( studentId, callback ) {
        var q = "SELECT cs.name, cs.description, ss.value FROM student_skill ss, class_skill cs WHERE ss.studentId = ? AND cs.id = ss.classSkillId";
        db.query(q,studentId,callback);
    },

    getStudentTop3Skills: function( studentId,callback ) {
        var q = "SELECT cs.name, cs.description, ss.value from student_skill ss, class_skill cs WHERE ss.studentId = 8 AND cs.id = ss.classSkillId ORDER BY value LIMIT 3;"
        db.query(q,studentId,callback)
    }
}
