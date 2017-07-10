var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentClassSkills: function( userId, callback ) {
        var q = "SELECT sc.classId, cs.assignmentId, a.name as assignmentName, a.title, cs.id as classSkillId, cs.name as skillName, cs.description FROM class_skill cs, student_class sc, assignment a, student s WHERE sc.classId = cs.classId AND sc.studentId = s.id and s.userId = ? AND cs.assignmentId = a.id ORDER by classId, assignmentId, classSkillId"
        db.query( q, userId, callback );
    },

    getUserSkills: function( userId, callback ) {
        var q = "SELECT cs.id as classSkillId, a.id as assignmentId, a.name as assignmentName, a.title, cs.name as skillName, cs.description as classDescription, ss.value FROM student_skill ss, class_skill cs, assignment a WHERE ss.studentId = ? AND cs.id = ss.classSkillId and cs.assignmentId = a.id";
        db.query(q,userId,callback);
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
        var q = "select a.id as assignmentId, a.name as assignmentName, a.description as description, c.id as courseId, at.name as taskName, at.id as taskId from assignment a, assignment_task at, class c, student s where s.userId = ? and a.classId = c.id and at.assignmentId = a.id";
        db.query(q,userId,callback);
    },

    setStudentSkills: function( studentId, classSkillId, skillValue , callback ) {
        var q =  "UPDATE student_skill  SET value = ? where  studentId = ? and classSkillId = ?";
        db.query(q,[skillValue,studentId,classSkillId], callback);
    },

    insertStudentSkills: function( studentId, classSkillId, skillValue , callback ) {
        var q = dbHelpers.buildInsert(config.student_skill_table) + dbHelpers.buildValues(["studentId","classSkillId", "value"]);
        db.query(q,[studentId, classSkillId, skillValue], callback);
    },
}
