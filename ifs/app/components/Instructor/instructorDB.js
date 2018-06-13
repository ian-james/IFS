/*
    Import the required configuration files and libraries
*/

var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    
    // should be in its own file not here and not in admin
    getRole: function( userId , callback ) {
        var q = "select role value from user_role ur, users u, roles r  where ur.userId = u.id and r.id = ur.roleId and u.id = ?";
        db.query(q,userId,callback);
    },

    /**
     * Get all classes belonging to the instructor in the database.
     * @param  integer instId The instructor id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getClasses: function(instId, callback) {
        dbHelpers.selectWhere( dbcfg.class_table, "instructorId" , instId, callback);
    },
    
    getAssignments: function(instId, callback){
        var q = `SELECT * FROM assignment WHERE classId in (SELECT 
                class.id FROM class WHERE instructorId=${instId}) ORDER BY deadline ASC`;
        db.query(q,[],callback);
    },

    getAssignmentDiscipline: function(aId, callback){
        var q = `SELECT disciplineType as discipline FROM class WHERE id in 
                (SELECT classId FROM assignment WHERE id=${aId})`;
        db.query(q,[],callback);
    },

    fetchAssignmentOptions: function(discipline_type, callback){
        dbHelpers.selectWhere(dbcfg.assignment_options_table, "disciplineType", discipline_type, callback);
    },

    getAssignmentChoices: function(aId, callback){
        dbHelpers.selectWhere(dbcfg.assignment_choices_table, "assignmentId", aId, callback);
    },

    fetchClassOptions: function(discipline, callback) {
        dbHelpers.selectWhere( dbcfg.class_options_table, "disciplineType", discipline, callback);
    },

    checkAssignmentAccess: function(assignmentId, instId, callback){
        var q = `SELECT COUNT(*) as found FROM  class WHERE id
                 in(SELECT classId FROM assignment WHERE 
                 id=${assignmentId}) AND instructorId=${instId}`
        db.query(q, [], callback);
    },

    
    /*************************************************
     ********* Instructor Dashboard Stats ************
     *************************************************/

    // NOTE: I made the queries manually since there is no join function in the dbhelper
    // This can be changed later, but it is just easier like this for now

    /**
     * Count all students that are part of the instructor's classes.
     * @param  integer instId The instructor id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    countInstStudents: function(instId, callback ) {
        var q = `SELECT COUNT(student_class.studentId) as students FROM student_class
                 LEFT OUTER JOIN class ON class.id = student_class.classId
                 WHERE class.instructorId=${instId}`; 
        db.query(q,[],callback);
    },
    /**
     * Count all students that are part of the instructor's classes, that were online this week.
     * @param  integer instId The instructor id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    countInstStudentsOTW: function(instId, callback ){
        var q = `SELECT COUNT(DISTINCT userId) as otw FROM user_interactions WHERE userId IN
                (SELECT student_class.studentId as students FROM student_class LEFT
                 OUTER JOIN class ON class.id = student_class.classId WHERE
                 class.instructorId=${instId}) AND date >= Date(NOW()) - INTERVAL 7 DAY`;
        db.query(q,[],callback);
    },

    /**
     * Count all weekly submissions of students in the instructor's classes.
     * @param  {Function} instId The instructor id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    countWeeklySubmission: function(instId, callback ){
        var q = `SELECT COUNT(userId) as weekSub FROM submission WHERE userId IN
        (SELECT student_class.studentId as students FROM student_class LEFT
         OUTER JOIN class ON class.id = student_class.classId WHERE
         class.instructorId=${instId}) AND date >= Date(NOW()) - INTERVAL 7 DAY`;
        db.query(q,[],callback);
    }
}