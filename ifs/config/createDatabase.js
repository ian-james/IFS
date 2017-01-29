var mysql = require('mysql');
var dbconfig = require('./database');

var Logger = require( path.join( __dirname, "/loggingConfig") );

var connection = mysql.createConnection( dbconfig.connection );

// Tell mysql to use the database
Logger.info("Create the database now");
//connection.query ('CREATE DATABASE ' + dbconfig.database );


console.log("Create the Table now");
connection.query(" CREATE TABLE " + dbconfig.database + "." + dbconfig.users_table + " ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    username VARCHAR(20) NOT NULL, \
    password CHAR(60) NOT NULL, \
    PRIMARY KEY(id) \
)");


connection.query(" CREATE TABLE " + dbconfig.database + "." + dbconfig.raw_feedback_table + " ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    username VARCHAR(20) NOT NULL, \
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    rawFeedback TEXT NOT NULL, \
    PRIMARY KEY(id) \
)");

connection.query(" CREATE TABLE " + dbconfig.database + "." + dbconfig.survey_table + " ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    surveyName VARCHAR(40) NOT NULL, \
    authorNames VARCHAR(30) NOT NULL, \
    creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    rawFeedback TEXT NOT NULL, \
    PRIMARY KEY(id) \
)");


Logger.info("Success: Database created.");

connection.end();