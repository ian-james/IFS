// This create database script has been modified to create the database, if neccessary.
// Run Knex migration for the newest database updates
// Create default accounts
// Create an event to clearly verify token used in the registration process

var mysql = require('mysql');
var dbcfg = require('./databaseConfig');
var dbConnect = require('./dbConnectionConfig.js')

var Logger = require('./loggingConfig') ;

try {
    console.log("Create Database.js Try make a connection....")
    var connection = mysql.createConnection( dbConnect.connection );
    console.log("Database Connection successful.")

    // Tell mysql to use the database
    if(connection) {
        Logger.info("Creating a database now, if it does not exist.");
        connection.query ('CREATE DATABASE IF NOT EXISTS ' + dbcfg.database );
        Logger.info("Success: Database created.");

    } else {
        Logger.error("Error, Unable to make connection to database")
    }
    //
    // end the connection; this was outside of the relevant scope before; can
    // you end a connection that failed?
    connection.end();
} catch(e) {
    Logger.error("Error: Unable to load database.");
}