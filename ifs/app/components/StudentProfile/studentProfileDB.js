var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentProfile: function( userId, callback ) {
        var q = dbHelpers.buildSelect(dbcfg.student_table) + dbHelpers.buildWS("userId");
        db.query(q,userId,callback);
    },

    /**
     * Update student profile as version should exists already.
     * @param {[type]}   userId   [description]
     * @param {[type]}   name     [description]
     * @param {[type]}   bio      [description]
     * @param {Function} callback [description]
     */
    insertStudentProfile: function( userId, name, bio, callback ) {
        var q = dbHelpers.buildInsert(dbcfg.student_table) + "( userId, name, bio) VALUES (?,?,?) ";
        db.query(q,[userId,name,bio],callback);
    },

    /**
     * Update student profile as version should exists already.
     * @param {[type]}   userId   [description]
     * @param {[type]}   name     [description]
     * @param {[type]}   bio      [description]
     * @param {Function} callback [description]
     */
    setStudentProfile: function( userId, name, bio, callback ) {
        var q = dbHelpers.buildUpdate(dbcfg.student_table) + " SET name = ?, bio = ? WHERE userId = ? ";
        db.query(q,[name,bio,userId],callback);
    },

    /**
     * Retrieve Student profile and class information.
     * Data return is an array of each course the student is currently particpating in.
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getStudentProfileAndClasses: function(userId, callback) {
        var q = "SELECT s.id,s.name,s.bio, c.id as courseId, c.code,c.name as courseName, c.description,c.disciplineType FROM student s, student_class sc, class c WHERE s.id = sc.studentId AND sc.classId = c.id AND s.userId = ?"; 
        db.query(q,userId,callback);
    }

}
