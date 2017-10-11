var mysql = require('mysql');
var dbcfg = require('./databaseConfig');
var Logger = require( __configs + "loggingConfig");
var Errors = require(__components + "Errors/errors");

var pool = mysql.createPool( {
    connectionLimit: dbcfg.connectionLimit,
    host: dbcfg.connection.host,
    user: dbcfg.connection.user,
    password: dbcfg.connection.password,
    database: dbcfg.database,
    debug: false
});

// Common functionality to handle releasing connection on error
// throw error
function handleConnectionError(err, connection){
    Errors.ifErrLog(err)
    if(connection)
      connection.release();
}

/* This is a generic query that get information from the database.clear
 * It uses a pool to create the connection and disconnects after.
 */
function query(queryStr, args, callback) {
   //Logger.info("Database query started");
   pool.getConnection(function(err,connection) {
        if(connection){
            connection.query( queryStr, args, function(err,data) {
                if(err) {
                    console.log("ERROR FOR STRING: ", queryStr);
                    console.log("ERROR ", err);
                }
                handleConnectionError(err,connection);
                callback(err, data);
            });
        }
        else {
            handleConnectionError(err);
            callback(err,null);
        }

        connection.on('error', function(err) {
            console.log("DB Connection error handled");
            handleConnectionError(err,connection);
        });
   });
}

module.exports.pool = pool;
module.exports.query = query;