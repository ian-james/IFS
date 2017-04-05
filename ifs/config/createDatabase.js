/* Essentially a script to generate all of the database information if required.
   This can be loaded via npm package.json or run separately.
*/

var mysql = require('mysql');
var config = require('./databaseConfig');

var Logger = require( "./loggingConfig") ;

try  {
    var connection = mysql.createConnection( config.connection );

    // Tell mysql to use the database
    if( connection ) {
        Logger.info("Create the database now");

        connection.query ('CREATE DATABASE IF NOT EXISTS ' + config.database );

        Logger.info("Create the Table:", config.users_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.users_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            username VARCHAR(20) NOT NULL, \
            password CHAR(60) NOT NULL, \
            PRIMARY KEY(id) \
        )");

        Logger.info("Create the Table:", config.raw_feedback_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.raw_feedback_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            username VARCHAR(20) NOT NULL, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            tools TEXT NOT NULL, \
            feedback TEXT NOT NULL, \
            PRIMARY KEY(id) \
        )");

        Logger.info("Create the Table:", config.survey_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.survey_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            surveyName VARCHAR(60) UNIQUE NOT NULL, \
            authorNames VARCHAR(60) NOT NULL, \
            title VARCHAR(60), \
            totalQuestions INT, \
            fullSurveyFile VARCHAR(80) NOT NULL, \
            PRIMARY KEY(id) \
        )");

         Logger.info("Create the Table:", config.survey_results_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.survey_results_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            surveyId Int UNSIGNED NOT NULL, \
            userId INT UNSIGNED NOT NULL, \
            dateComplete TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (surveyId) REFERENCES " + config.database + "." +config.survey_table + "(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." +config.users_table + "(id) \
        )");
    
        Logger.info("Create the Table:", config.survey_preferences_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.survey_preferences_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            surveyId Int UNSIGNED NOT NULL, \
            userId INT UNSIGNED NOT NULL, \
            surveyStartDate DATETIME DEFAULT CURRENT_TIMESTAMP, \
            lastRevision TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
            pauseAsking BOOL DEFAULT FALSE, \
            pauseTime TIME, \
            allowedToAsk BOOL DEFAULT TRUE, \
            currentIndex INT DEFAULT 0, \
            lastIndex INT DEFAULT 10, \
            PRIMARY KEY(id), \
            FOREIGN Key (surveyId) REFERENCES " + config.database + "." + config.survey_table + "(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id), \
            UNIQUE KEY 'survey_userIds' (surveyId,userId) \
        )");


        Logger.info("Create the Table:", config.question_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.question_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            surveyId Int UNSIGNED NOT NULL, \
            language CHAR(10) NOT NULL, \
            origOrder INT UNSIGNED NOT NULL, \
            text TEXT NOT NULL, \
            visualFile Text, \
            type ENUM ('matrix','rating','text','radiogroup') NOT NULL, \
            PRIMARY KEY(id), \
            FOREIGN Key (surveyId) REFERENCES " + config.database + "." +config.survey_table + "(id) \
        )");
        Logger.info("Success: Database created.");

    }
    else
        Logger.error("Error, Unable to make connection to database")
}
catch( e )
{
    Logger.error("Error: Unable to load database.");
}


connection.end();