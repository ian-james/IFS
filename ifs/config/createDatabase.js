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
            sessionId INT NOT NULL DEFAULT 0, \
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
            questionId VARCHAR(20) NOT NULL, \
            questionAnswer VARCHAR(80) NOT NULL, \
            surveyResponseId INT NOT NULL DEFAULT 0, \
            answeredOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (surveyId) REFERENCES " + config.database + "." +config.survey_table + "(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id) \
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
            currentSurveyIndex INT NOT NULL DEFAULT 0, \
            PRIMARY KEY(id), \
            FOREIGN Key (surveyId) REFERENCES " + config.database + "." + config.survey_table + "(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id), \
            UNIQUE Key survey_userIds (surveyId,userId) \
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

        Logger.info("Create the Table:", config.users_interation_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.users_interation_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL, \
            eventType VARCHAR(40) NOT NULL, \
            name VARCHAR(40) NOT NULL, \
            data TEXT NOT NULL, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id) \
        )");

        Logger.info("Create the Table:", config.preferences_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.preferences_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            prefId INT UNSIGNED NOT NULL DEFAULT 0, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id) \
        )");

        Logger.info("Create the Table:", config.submission_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.submission_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL DEFAULT 0, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id) \
        )");

        Logger.info("Create the Table:", config.feedback_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.feedback_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL DEFAULT 0, \
            submissionId INT UNSIGNED NOT NULL, \
            toolName TEXT NOT NULL, \
            filename TEXT NOT NULL, \
            runType TEXT NOT NULL, \
            type TEXT NOT NULL, \
            charPos INT UNSIGNED, \
            charNum INT UNSIGNED, \
            lineNum INT UNSIGNED, \
            target TEXT, \
            suggestions TEXT, \
            feedback TEXT, \
            severity TEXT, \
            hlBeginChar INT UNSIGNED, \
            hlEndChar INT UNSIGNED, \
            hlBeginLine INT UNSIGNED, \
            hlEndLine INT UNSIGNED, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id), \
            FOREIGN Key (submissionId) REFERENCES " + config.database + "." + config.submission_table + "(id) \
        )");

        Logger.info("Create the Table:", config.feedback_interaction_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + config.database + "." + config.feedback_interaction_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL DEFAULT 0, \
            submissionId INT UNSIGNED NOT NULL, \
            feedbackId INT UNSIGNED NOT NULL, \
            action TEXT NOT NULL, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + config.database + "." + config.users_table + "(id), \
            FOREIGN Key (submissionId) REFERENCES " + config.database + "." + config.submission_table + "(id), \
            FOREIGN Key (feedbackId) REFERENCES " + config.database + "." + config.feedback_table + "(id) \
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