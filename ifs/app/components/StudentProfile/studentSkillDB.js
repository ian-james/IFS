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
        var q = "SELECT cs.name, cs.description, ss.value from student_skill ss, class_skill cs WHERE ss.studentId = ? AND cs.id = ss.classSkillId ORDER BY value LIMIT 3"
        db.query(q,studentId,callback)
    },

    getStudentTasks: function( studentId, callback ) {
        var q = "SELECT cs.name, cs.description, ss.value FROM student_skill ss, class_skill cs WHERE ss.studentId = ? AND cs.id = ss.classSkillId";
        db.query(q,studentId,callback);
    },


    /**
     * Gets the classId,assignmentId and skills for all classes. IE not user specific.
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAssigmentAndTaskList: function( userId, callback ) {
        var q = "select a.id as assignmentId, a.name as assignmentName, c.id as courseId, at.name as taskName, at.id as taskId from assignment a, assignment_task at, class c, student s where s.userId = 1 and a.classId = c.id and at.assignmentId = a.id";
        db.query(q,userId,callback);
    }
}
