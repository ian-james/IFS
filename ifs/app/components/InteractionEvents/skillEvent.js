var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    
    getSkillsDifferenceOverTime: function( studentId  ){
        return {
            'name': "skillsDifferenceOverTime",
            'data':[studentId],
            'request': "select res.student, res.classSkillId, SUM(res.diff) as value " +
                    "from (select a.id as aid, a.studentId as student, a.classSkillId, a.value as aval, b.id as bid, b.value as bval, b.value-a.value as diff " +
                    "from student_skill a, student_skill b " + 
                    "where b.id = (select min(id) from student_skill where id > a.id and classSkillId = a.classSkillId and studentId=a.studentId) ) res " +
                    "where res.student = ? GROUP BY res.classSkillId, res.student"
        };
    },

    getTotalSkillsRating: function( userId ) {
        return {
            'name': "totalSkillsRating",
            'data':[studentId],
            'request': "select count(id) from student_skill where studentId = ?"
        };
    }
};