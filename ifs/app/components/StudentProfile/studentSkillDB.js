var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentClassSkills: function( studentId, callback ) {
        var q = "SELECT sc.classId, cs.assignmentId, a.name as assignmentName, a.title, cs.id as classSkillId, cs.name as skillName, cs.description FROM class_skill cs, student_class sc, assignment a, student s WHERE sc.classId = cs.classId AND sc.studentId = s.id and s.id = ? AND cs.assignmentId = a.id ORDER by classId, assignmentId, classSkillId"
        db.query( q, studentId, callback );
    },

    getStudentSkills: function( studentId, callback ) {
        var q = "SELECT cs.id as classSkillId, a.id as assignmentId, a.name as assignmentName, a.title, cs.name as skillName, cs.description as classDescription, ss.value FROM (select * from student_skill where (studentId, classSkillId, lastRated) IN ( SELECT studentId,classSkillId,max(lastRated) as lastRated from student_skill GROUP BY studentId,classSkillId )) ss, class_skill cs, assignment a WHERE ss.studentId = ? AND cs.id = ss.classSkillId and cs.assignmentId = a.id";
        db.query(q,studentId,callback);
    },

    getStudentTop3Skills: function( studentId,callback ) {
        console.log("Log me ", studentId );
        var q = "SELECT cs.id as classSkillId, a.id as assignmentId, a.name as assignmentName, a.title, cs.name as skillName, cs.description as classDescription, ss.value FROM (select * from student_skill where (studentId, classSkillId, lastRated) IN ( SELECT studentId,classSkillId,max(lastRated) as lastRated from student_skill GROUP BY studentId,classSkillId )) ss, class_skill cs, assignment a WHERE ss.studentId = ? AND cs.id = ss.classSkillId and cs.assignmentId = a.id ORDER BY value LIMIT 3";
        db.query(q,studentId,callback)
    },
/*
    getStudentTasks: function( studentId, callback ) {
        var q = "SELECT cs.name, cs.description, ss.value FROM student_skill ss, class_skill cs WHERE ss.studentId = ? AND cs.id = ss.classSkillId";
        db.query(q,studentId,callback);
    },
    */


    /**
     * Gets the classId,assignmentId, skills, tasks and taskComplete for all classes.
     * Large ugly mysql functions... :(
     * * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAssigmentAndTaskList: function( userId, callback ) {
        var q = "select a.id as assignmentId, a.name as assignmentName, a.description as description, c.id as courseId, d.id as assignmentTaskId, d.name as taskName, d.description as at_desc, d.taskId as taskId, d.value as isComplete" +
               " from class c, assignment a, student s, (select at.*,b.id as taskId, ifnull(b.isComplete, 0) as value from assignment_task at LEFT Join student_assignment_task b on at.id = b.assignmentTaskId) d " +
               " where s.userId = ? and a.classId = c.id and a.id = d.assignmentId";
        db.query(q,userId,callback);
    },

/*
    setStudentSkills: function( studentId, classSkillId, skillValue , callback ) {
        var q =  "UPDATE student_skill  SET value = ? where  studentId = ? and classSkillId = ?";
        db.query(q,[skillValue,studentId,classSkillId], callback);
    },
*/

    insertStudentSkills: function( studentId, classSkillId, skillValue , callback ) {
        var q = dbHelpers.buildInsert(dbcfg.student_skill_table) + dbHelpers.buildValues(["studentId","classSkillId", "value"]);
        db.query(q,[studentId, classSkillId, skillValue], callback);
    },

    insertStudentAssignmentTask: function( studentId, assignmentTaskId, isComplete, callback ) {
        var q = dbHelpers.buildInsert(dbcfg.student_assignment_task_table) + dbHelpers.buildValues(["studentId","assignmentTaskId", "isComplete"]) + "ON Duplicate Key update isComplete=Values(isComplete)";
        db.query(q,[studentId, assignmentTaskId, isComplete], callback);
    },

    getStudentAssignmentsAndTasks: function( studentId, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.student_assignment_task_table) + dbHelpers.buildWS("studentId");
        db.query(q,studentId, callback);
    },
}
