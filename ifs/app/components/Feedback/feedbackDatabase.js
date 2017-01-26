/*var mysql = require('mysql');
var dbconfig = require('../../config/database.js');

var connection = mysql.createConnection( dbconfig.connection );

function insertFeedback( feedback ) {
    const insertQuery = 'INSERT INTO ' + dbconfig.raw_feedback_table + ' SET ? ';

    connection.query( insertQuery, feedback , function(err,result) {
        if(err) {
            console.log("Error inserting into database feedback");
        }
        else {
            return result;
        }
    });
}

module.export.addRawFeedback = insertFeedback;
*/