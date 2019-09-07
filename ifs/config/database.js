var mysql = require('mysql');
var dbcfg = require('./dbConnectionConfig.js');
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
    if(connection) {
      connection.release();
    }
}

/* This is a generic query that get information from the database.clear
 * It uses a pool to create the connection and disconnects after.
 */
function query(queryStr, args, callback) {
   //Logger.info("Database query started");
   //console.log("DATABASE QUERY STARTED", queryStr);

    pool.query( queryStr, args, function(err,data) {
        if(err)
            console.log("ERROR FOR STRING: ", err, " >>> " , queryStr);
        callback(err, data);
    });
}

const knexCfg = require('knex')({
    client: 'mysql',
    connection: {
        host: dbcfg.connection.host,
        user: dbcfg.connection.user,
        password: dbcfg.connection.password,
        database: dbcfg.database,
    },
    pool: {
        min: 0,
        max: 7,
    }
});

module.exports.pool = pool;
module.exports.query = query;
module.exports.knex = knexCfg;