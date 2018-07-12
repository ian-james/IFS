var db = require( __configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");

var dbHelpers = require(__components + "Databases/dbHelpers");

module.exports = {
    
    getTotalTasksMarkedComplete: function( userId  ){
        return {
            'name': "totalTasksMarkedComplete",
            'data':[userId],
            'request': "select count(isComplete) as value from student_assignment_task where studentId = ? and isComplete = 1"
        };
    },

    getTotalTasks: function( userId ) {
        return {
            'name': "totalTasks",
            'data':[userId],
            'request': "select count(isComplete) as value from student_assignment_task where studentId = ?"
        };
    }
};