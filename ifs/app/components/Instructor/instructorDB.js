/*
    Import the required configuration files and libraries
*/

var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");
var SqlString = require('sqlstring');

module.exports = {

    /**
     * Ensure that the user has access to the assignment
     * @param  integer assignmentId The assignment id
     * @param  integer instId       The instructor id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    checkAssignmentAccess: function(assignmentId, instId, callback){
        var q = `SELECT COUNT(*) as found FROM class WHERE id
                 in(SELECT classId FROM assignment WHERE
                 id=${assignmentId}) AND instructorId=${instId}`;
        db.query(q, [], callback);
    },

     /**
     * Ensure that the user has access to the class.
     * @param  integer classId The assignment id
     * @param  integer instId       The instructor id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    checkClassAccess: function(classId, instId, callback){
        var q = `SELECT COUNT(*) as found FROM class WHERE
                id=${classId} AND instructorId=${instId}`;
        db.query(q, [], callback);
    },

    checkEventAccess: function(eventId, instId, callback){
        var q = `SELECT COUNT(*) as found FROM class WHERE id in (SELECT classId
                FROM upcoming_event WHERE id=${eventId}) AND instructorId=${instId}`;
        db.query(q, [], callback);
    },

    /**
     * Get the options for a certain discipline for a assignment
     * @param  string discipline_type The discipline
     * @param  boolean All            Fetch all results
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    fetchAssignmentOptions: function(discipline_type, all, callback){
        if(!all)
            dbHelpers.selectWhere(dbcfg.assignment_options_table, "disciplineType", discipline_type, callback);
        else
        {
            var q = dbHelpers.buildSelect(dbcfg.assignment_options_table);
            db.query(q,[],callback);
        }
    },

    /**
     * Get the options for a certain discipline for a class
     * @param  string discipline   The discipline
     * @param  boolean all         Fetch all results
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    fetchClassOptions: function(discipline, all, callback) {
        if(!all)
            dbHelpers.selectWhere( dbcfg.class_options_table, "disciplineType", discipline, callback);
        else
        {
            var q = dbHelpers.buildSelect(dbcfg.class_options_table);
            db.query(q,[],callback);
        }
    },

    /**
     * Fetches an assignment based on an assignmentId
     * @param integer assignmentId The assignment id
     * @param {Function} callback  [description]
     * @return {[type]}            [description]
     */
    getAssignment: function(assignmentId, callback){
        dbHelpers.selectWhere(dbcfg.assignment_table, "id", assignmentId, callback);
    },

    /**
     * Get the assignments for a specific instructor
     * @param  integer instId   The instructor id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAssignments: function(instId, callback){
        var q = `SELECT * FROM assignment WHERE classId in (SELECT
                class.id FROM class WHERE instructorId=${instId}) ORDER BY deadline ASC`;
        db.query(q,[],callback);
    },

    getEvents: function(instId, callback){
        var q = `SELECT * FROM upcoming_event WHERE classId in (SELECT id
                FROM class WHERE instructorId=${instId})`;
        db.query(q, [], callback);
    },

    getEvent: function(eventId, callback){
        dbHelpers.selectWhere(dbcfg.upcoming_event_table, "id", eventId, callback);
    },

    /**
     * Get the skills
     * @param {Function} callback [description]
     */
    getSkills: function(callback){
        var q = `SELECT * from skills`;
        db.query(q,[], callback);
    },

    /**
     * Get the assignments choices for a specific assignment
     * @param  integer aId   The assignment id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAssignmentChoices: function(aId, callback){
        dbHelpers.selectWhere(dbcfg.assignment_choices_table, "assignmentId", aId, callback);
    },

    /**
     * Get the discipline of an assignment.
     * @param  integer aId   The assignment id.
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getAssignmentDiscipline: function(aId, callback){
        var q = `SELECT disciplineType as discipline FROM class WHERE id in
                (SELECT classId FROM assignment WHERE id=${aId})`;
        db.query(q,[],callback);
    },

    /**
     * Get the skills of an assignment.
     * @param integer aId The assignment id.
     * @param {Function} callback [description]
     * @return{[type]}            [description]
     */
    getAssignmentSkills: function(aId, callback){
        var q = `SELECT * FROM class_skill WHERE assignmentId=${aId}`;
        db.query(q, [], callback);
    },

    /**
     * Fetches a class based on an classId
     * @param integer classId The class id
     * @param {Function} callback  [description]
     * @return {[type]}            [description]
     */
    getClass: function(classId, callback){
        dbHelpers.selectWhere(dbcfg.class_table, "id", classId, callback);
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

    /**
     * Get the skills of an assignment.
     * @param integer aId The assignment id.
     * @param {Function} callback [description]
     * @return{[type]}            [description]
     */
    getClassSkills: function(cId, callback){
        var q = `SELECT * FROM class_skill WHERE classId=${cId} AND assignmentId=-1`;
        db.query(q, [], callback);
    },

    /**
     * Get a random tip to display on the instructor dashboard.
     * @param   {Function} callback [description]
     * @return {[type]}              none
     */
    getRandomTip: function(callback){
       var q = "SELECT * FROM ifs_tips WHERE instructor=1 ORDER by RAND() LIMIT 1";
       db.query(q,[],callback);
    },


    /**
     * Get the role of the user
     * @param  integer userId The user id
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getRole: function( userId , callback ) {
        var q = "select role value from user_role ur, users u, roles r  where ur.userId = u.id and r.id = ur.roleId and u.id = ?";
        db.query(q,userId,callback);
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
    },

    /**
     * Inserts a course into its table.
     * @param array courseData The course data
     * @param {Function} callback
     */
    insertCourse: function(courseData, callback) {
        console.log( courseData );
        var q = dbHelpers.buildInsert(dbcfg.class_table) + dbHelpers.buildValues(["code","name","description","disciplineType", "instructorId", "year", "semester"]);
        db.query(q, courseData, callback);
    },

    /**
     * Inserts a assignment into its table.
     * @param array assignmentData The assignment data
     * @param {Function} callback
     */
    insertAssignment: function(assignmentData, callback) {
        var q = dbHelpers.buildInsert(dbcfg.assignment_table) + dbHelpers.buildValues(["classId", "name", "title", "description", "deadline"]);
        db.query(q, assignmentData, callback);
    },

    /**
     * Inserts a event into its table.
     * @param array eventData The event data
     * @param {Function} callback
     */
    insertEvent: function(eventData, callback) {
        var q = dbHelpers.buildInsert(dbcfg.upcoming_event_table) + dbHelpers.buildValues(["classId", "name", "title", "description", "openDate", "closedDate"]);
        db.query(q, eventData, callback);
    },

    /**
     * Inserts a skill into its table.
     * @param array skill The skill data
     * @param {Function} callback
     */
    insertSkill: function(skill, callback) {
        var q  = dbHelpers.buildInsert(dbcfg.skills_table) + dbHelpers.buildValues(["name"]);
        db.query(q, [skill], callback);
    },

    /**
     * Inserts a class skill into its table.
     * @param array data The class skill data.
     * @param {Function} callback
     */
    insertClassSkill: function(data, callback){
        var q = dbHelpers.buildInsert(dbcfg.class_skill_table) + dbHelpers.buildValues(["classId", "assignmentId", "name"]);
        db.query(q, data, callback);
    },

     /**
     * Inserts a class skill into its table.
     * @param array data The class skill data.
     * @param {Function} callback
     */
    //**** TODO: UGH HACK -> IFS allows NULL assignmentID so can't be giving -1 values */
    insertClassSkillNoAssignment: function(data, callback){
        var q = dbHelpers.buildInsert(dbcfg.class_skill_table) + dbHelpers.buildValues(["classId",  "name"]);
        db.query(q, data, callback);
    },

    /**
     * Updates an assignment.
     * @param array data The assignment data.
     * @param integer aid The assignment id
     * @param {Function} callback
     */
    updateAssignment: function(data, aid, callback){
        var q = `UPDATE assignment set name='${data[0]}', title='${data[1]}', description='${data[2]}', deadline='${data[3]}' WHERE id=${aid}`
        db.query(q, [], callback);
    },

    /**
     * Deletes all assignment skills for a assignment id.
     * @param integer aid The assignment id.
     * @param {Function} callback
     */
    deleteAssignmentSkills: function(aid, callback){
        var q = `DELETE from class_skill WHERE assignmentId=${aid}`;
        db.query(q, [], callback);
    },

    /**
     * Updates a class.
     * @param array data The class data.
     * @param integer cid The class id.
     * @param {Function} callback
     */
    updateClass: function(data, cid, callback){
        var q = `UPDATE class set code='${data[0]}', name='${data[1]}', description='${data[2]}', disciplineType='${data[3]}', year='${data[4]}', semester='${data[5]}' WHERE id=${cid}`
        db.query(q, [], callback);
    },

    /**
     * Updates a event.
     * @param array data The event data.
     * @param integer id The id.
     * @param {Function} callback
     */
    updateEvent: function(data, id, callback){
        var q = `UPDATE upcoming_event set name='${data[0]}', title='${data[1]}', description='${data[2]}', openDate='${data[3]}', closedDate='${data[4]}' WHERE id=${id}`
        db.query(q, [], callback);
    },

    /**
     * Delets all class skills for a class id.
     * @param integer cid The class id.
     * @param {Function} callback
     */
    deleteClassSkills: function(cid, callback){
        var q = `DELETE from class_skill WHERE classId=${cid} AND assignmentId=-1`;
        db.query(q, [], callback);
    },

    /**
     * Deletes an assignment.
     * @param integer aid The assignment id.
     * @param {Function} callback
     */
    deleteAssignment: function(aid, callback){
        var q = `DELETE from assignment WHERE id=${aid}`;
        db.query(q,[]);
    },

    /**
     * Deletes an event.
     * @param integer eid The event id.
     * @param {Function} callback
     */
    deleteEvent: function(eid, callback){
        var q = `DELETE from upcoming_event WHERE id=${eid}`;
        db.query(q,[]);
    },

    /**
     * Deletes all tasks for a given assignment id.
     * @param integer aid The assignment id.
     * @param {Function} callback
     */
    deleteTasks: function(aid, callback){
        var q = `DELETE from assignment_task WHERE assignmentId=${aid}`;
        db.query(q,[]);
    },

    /**
     * Inserts a task into its table
     * @param array task The task data
     * @param {Function} callback
     */
    taskInsert: function(task, callback){
        var q = dbHelpers.buildInsert(dbcfg.assignment_task_table) + dbHelpers.buildValues(["assignmentId","name","description"])
        db.query(q,task,callback);
    },

    /**
     * Fetches all tasks for an assignment.
     * @param integer aid The assignment id.
     * @param {Function} callback
     */
    getTasks : function(aid, callback){
        var q = `SELECT * FROM assignment_task WHERE assignmentId=${aid}`;
        db.query(q, [], callback);
    }
}