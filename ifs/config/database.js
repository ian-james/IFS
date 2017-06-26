var mysql = require('mysql');
var config = require('./databaseConfig');
var Logger = require( __configs + "loggingConfig");
var Errors = require(__components + "Errors/errors");

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

        //console.log("IN QUERY ");
        if(connection){
            //console.log("QUERY: ", queryStr, JSON.stringify(args));
            connection.query( queryStr, args, function(err,data) {
                if(err) {
                    console.log("ERROR FOR STRING: ", queryStr);
                    console.log("ERROR ", err);
                }
                Errors.ifErrLog(err);

                //console.log("QUERY RETURNED DATA:\n", JSON.stringify( data ));
                callback(err, data);
                connection.release();
            });
        }
        else {
            //console.log("ERR IN QUERY");
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



