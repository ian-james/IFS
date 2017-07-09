var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getRole: function( userId , callback ) {
        var q = "select role value from user_role ur, users u, roles r  where ur.userId = u.id and r.id = ur.roleId and u.id = ?";
        db.query(q,userId,callback);
    },

    isAdmin: function( role ) {
        return role == "admin";
    },

    insertCourse: function(course, callback){
        var q = dbHelpers.buildInsert(config.class_table) + dbHelpers.buildValues(["code","name","description","disciplineType"])
        db.query(q,course,callback);
    },

    insertUpcomingEvent: function(event, callback){
        var q = dbHelpers.buildInsert(config.upcoming_event_table) + dbHelpers.buildValues(["classId","name","title","description","openDate","closedDate"])
        db.query(q,event,callback);
    },

    insertAssignment: function(assignment, callback){
        var q = dbHelpers.buildInsert(config.assignment_table) + dbHelpers.buildValues(["classId","name","title","description","deadline"])
        db.query(q,assignment,callback);
    },

    insertSkill: function(skill, callback){
        var q = dbHelpers.buildInsert(config.class_skill_table) + dbHelpers.buildValues(["classId","assignmentId","name","description"])
        db.query(q,skill,callback);
    },

    insertTask: function(skill, callback){
        var q = dbHelpers.buildInsert(config.assignment_task_table) + dbHelpers.buildValues(["assignmentId","name","description"])
        db.query(q,skill,callback);
    },


    /**
     * Get all courses in the database.
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAllClasses: function(callback) {
        var q = dbHelpers.buildSelect( config.class_table );
        db.query(q,[],callback);
    },

    getAllEvents: function(callback) {
        var q = dbHelpers.buildSelect( config.upcoming_event_table );
        db.query(q,[],callback);
    },

    /**
     * Get all skills for any course.
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAllSkills: function(callback) {
        var q = dbHelpers.buildSelect( config.class_skill_table );
        db.query(q,[],callback);
    },

     /**
     * Get all Tasks for any course and assigment pair.
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAllTasks: function(callback) {
        var q = dbHelpers.buildSelect( config.assignment_task_table );
        db.query(q,[],callback);
    },

    /**
     * Get a class by it's code name
     * @param  {[type]}   classCodeName [description]
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    getClassByCode: function( classCodeName, callback ) {
        var q = dbHelpers.buildSelect( config.class_table ) + dbHelpers.buildWS('code');
        db.query(q,classCodeName,callback);
    },

    /**
     * Get All assignments no restrictions.
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAllAssignments: function( callback )  {
        var q = dbHelpers.buildSelect( config.assignment_table );
        db.query(q,[],callback);
    },

    /**
     * Search database for assignment name and class name.
     * Assignment is allowed to be null as skill might be learned throughout course.
     * @param  {[type]}   classCode      [description]
     * @param  {[type]}   assignmentName [description]
     * @param  {Function} callback       [description]
     * @return {[type]}                  [description]
     */
    getAssignmentByClassCodeAndName( classCode, assignmentName, callback ) {
        if(assignmentName) {
            var q = "select c.id as classId, a.id as aId from class c, assignment a where c.id = a.classId and c.code= ? and a.name = ?";
            db.query(q,[classCode, assignmentName],callback);
        }
        else {
            var q = "select c.id as classId from class c where c.code= ?";
            db.query(q,[classCode],callback);
        }
    },

    /*********************************************************************************/
    deleteById: function( table, id, callback ){
        var q = dbHelpers.buildDelete(table) + dbHelpers.buildWS("id")
        db.query(q,[id],callback);
    },

    deleteByIds: function( table, ids, callback ){
        var q = dbHelpers.buildDelete(table) + " where id in (?)"
        db.query(q,ids,callback);
    },

    /*********************************************************************************/
    deleteCourse: function(courseId, callback){
        module.exports.deleteById(config.class_table,courseid,callback);
    },

    deleteCourses: function(ids, callback){
        module.exports.deleteByIds(config.class_table,ids,callback);
    },

    deleteEvents: function(ids, callback){
        module.exports.deleteByIds(config.upcoming_event_table,ids,callback);
    },

    deleteSkills: function(ids, callback){
        module.exports.deleteByIds(config.class_skill_table,ids,callback);
    },

    deleteAssignments: function(ids, callback){
        module.exports.deleteByIds(config.assignment_table,ids,callback);
    },

    deleteTasks: function(ids, callback){
        module.exports.deleteByIds(config.assignment_task_table,ids,callback);
    },

    /***************************** Admin Stats *************************************/
    countTotalStudents: function( callback ) {
        var q = dbHelpers.buildSelect(config.student_table,"COUNT(*) as totalStudents");
        db.query(q,[],callback);
    },

    countStudentsOnlineThisWeek: function( callback ){
        var q = "select COUNT(DISTINCT userId) as studentsOnlineThisWeek from userInteractions where date >= Date(NOW()) - INTERVAL 7 DAY";
        db.query(q,[],callback);
    },

    countStudentPerDisciplineThisWeek: function( callback ) {
        var q = "select COUNT(sc.studentId) as countDiscipline, c.disciplineType from student_class sc, class c where sc.classId = c.id GROUP BY c.disciplineType";
        db.query(q,[],callback);
    },

    countWeeklySubmission: function( callback ){
        var q =  "select COUNT(*) as weeklySubmissions from "  + config.submission_table +  " where date >= Date(NOW()) - INTERVAL 7 DAY"
        db.query(q,[],callback);
    }
}
