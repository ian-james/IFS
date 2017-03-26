var mysql = require('mysql');
var config = require('./databaseConfig');
var Logger = require( __configs + "loggingConfig");

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
        Logger.error("Error: Handling database connection error");
		if( connection )
        	connection.release();
        throw err;
    }
}

/* This is a generic query that get information from the database.clear

   It uses a pool to create the connection and disconnects after.
*/
function query( queryStr, args, callback) {
   //Logger.info("Database query started");
   pool.getConnection( function(err,connection) {

       handleConnectionError( err, connection );

        if( connection ){
            //Logger.info("Db connection ok, make the call");
            connection.query( queryStr, args, function(err,data) {
                callback(err, data);
                connection.release();
            });
        }
        else {
          Logger.error("Error getting DB connection");
        }

        connection.on('error', function(err) {
           handleConnectionError(err,connection);
        });

   });
}

module.exports.pool = pool;
module.exports.query = query;



