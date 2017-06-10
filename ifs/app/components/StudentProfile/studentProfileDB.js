var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {

    getStudentProfile: function( userId, callback ) {
        var q = dbHelpers.buildSelect(config.student_table) + dbHelpers.buildWS("userId");
        db.query(q,userId,callback);
    },

    /**
     * Update student profile as version should exists already.
     * @param {[type]}   userId   [description]
     * @param {[type]}   name     [description]
     * @param {[type]}   bio      [description]
     * @param {[type]}   filename [description]
     * @param {Function} callback [description]
     */
    insertStudentProfile: function( userId, name, bio, filename, callback ) {
        var q = dbHelpers.buildInsert(config.student_table) + "( userId, name, bio, avatarFileName ) VALUES (?,?,?,?) ";
        db.query(q,[userId,name,bio,filename],callback);
    },


    /**
     * Update student profile as version should exists already.
     * @param {[type]}   userId   [description]
     * @param {[type]}   name     [description]
     * @param {[type]}   bio      [description]
     * @param {[type]}   filename [description]
     * @param {Function} callback [description]
     */
    setStudentProfile: function( userId, name, bio, filename, callback ) {
        var q = dbHelpers.buildUpdate(config.student_table) + " SET name = ?, bio = ?, avatarFileName = ? where userId = ? ";
        db.query(q,[name,bio,filename,userId],callback);
    },

    /**
     * Retrieve Student profile and class information.
     * Data return is an array of each course the student is currently particpating in.
     * @param  {[type]}   userId   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getStudentProfileAndClasses: function( userId, callback )
    {
        var q = "select s.id,s.name,s.bio,s.avatarFileName, c.code,c.name as courseName ,c.description,c.disciplineType from student s, student_class sc, class c where s.id = sc.studentId and sc.classId = c.id and s.userId =?";
        // console.log("QUERYING STUDENT PROFILE AND CLASSES");
        db.query(q,userId,callback);
    }
}
