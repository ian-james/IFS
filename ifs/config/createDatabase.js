var mysql = require('mysql');
var config = require('./databaseConfig');

var Logger = require( "./loggingConfig") ;

var connection = mysql.createConnection( config.connection );

// Tell mysql to use the database
if( connection )
    Logger.info("Create the database now");
connection.query ('CREATE DATABASE ' + config.database );



Logger.info("Create the Table:", config.users_table);
connection.query(" CREATE TABLE " + config.database + "." + config.users_table + " ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    username VARCHAR(20) NOT NULL, \
    password CHAR(60) NOT NULL, \
    PRIMARY KEY(id) \
)");


Logger.info("Create the Table:", config.raw_feedback_table);
connection.query(" CREATE TABLE " + config.database + "." + config.raw_feedback_table + " ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    username VARCHAR(20) NOT NULL, \
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    tools TEXT NOT NULL, \
    feedback TEXT NOT NULL, \
    PRIMARY KEY(id) \
)");

Logger.info("Create the Table:", config.survey_table);
connection.query(" CREATE TABLE " + config.database + "." + config.survey_table + " ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    surveyName VARCHAR(40) NOT NULL, \
    authorNames VARCHAR(30) NOT NULL, \
    creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    rawFeedback TEXT NOT NULL, \
    PRIMARY KEY(id) \
)");


Logger.info("Success: Database created.");

connection.end();