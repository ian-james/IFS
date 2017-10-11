var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
/*
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

    getAssigmentAndTaskList: function( userId, callback ) {
        var q = "select a.id as assignmentId, a.name as assignmentName, a.description as description, c.id as courseId, at.name as taskName, at.id as taskId from assignment a, assignment_task at, class c, student s where s.userId = ? and a.classId = c.id and at.assignmentId = a.id";
        db.query(q,userId,callback);
    },

    setStudentSkills: function( studentId, classSkillId, skillValue , callback ) {
        var q =  "UPDATE student_skill  SET value = ? where  studentId = ? and classSkillId = ?";
        db.query(q,[skillValue,studentId,classSkillId], callback);
    },


    insertStudentSkills: function( studentId, classSkillId, skillValue , callback ) {
        var q = dbHelpers.buildInsert(dbcfg.student_skill_table) + dbHelpers.buildValues(["studentId","classSkillId", "value"]);
        db.query(q,[studentId, classSkillId, skillValue], callback);
    },
        */

    /**
     * This function inserts an assignment task as either complete or imcomplete.
     * It will update if the value exists.
     * @param  {[type]}   studentId        [description]
     * @param  {[type]}   assignmentTaskId [description]
     * @param  {Boolean}  isComplete       [description]
     * @param  {Function} callback         [description]
     * @return {[type]}                    [description]
     */
    insertStudentAssignmentTask: function( studentId, assignmentTaskId, isComplete, callback ) {
        var q = dbHelpers.buildInsert(dbcfg.student_assignment_task_table) + dbHelpers.buildValues(["studentId","assignmentTaskId", "isComplete"]) + "ON Duplicate Key update isComplete=Values(isComplete)";
        db.query(q,[studentId, assignmentTaskId, isComplete], callback);
    },

    /**
     * Get all of a student's assignments and tasks.
     * @param  {[type]}   studentId        [description]
     * @param  {[type]}   assignmentTaskId [description]
     * @param  {Boolean}  isComplete       [description]
     * @param  {Function} callback         [description]
     * @return {[type]}                    [description]
     */
    getStudentAssignmentsAndTasks: function( studentId, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.student_assignment_task_table) + dbHelpers.buildWS("studentId");
        db.query(q,studentId, callback);
    },
    
}
