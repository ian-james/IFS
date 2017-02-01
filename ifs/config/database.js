var mysql = require('mysql');
var config = require('./databaseConfig');

var pool = mysql.createPool( {
    connectionLimit: config.connectionLimit,
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.password,
    database: config.database,
    debug: false
});

// Common functionality to handle releasing connection on error
// throw error 
function handleConnectionError( err,connection){
    if(err) {
        connection.release();
        throw er
    }
}

/* This is a generic query that get information from the database.
   It uses a pool to create the connection and disconnects after.
*/
function query( queryStr, args, callback) {
   pool.getConnection( function(err,connection) {

       handleConnectionError( err, connection );

        if( connection ){
            connection.query( queryStr, args, function(err,data) {
                callback(err, data);
                connection.release();
            });
        }

        connection.on('error', function(err) {
           handleConnectionError(err,connection);
        });

   });
}

module.exports.pool = pool;
module.exports.query = query;



