/* Essentially a script to generate all of the database information if required.
   This can be loaded via npm package.json or run separately.
*/

var mysql = require('mysql');
var dbcfg = require('./databaseConfig');

var Logger = require('./loggingConfig') ;

try {
    var connection = mysql.createConnection( dbcfg.connection );

    // Tell mysql to use the database
    if(connection) {
        Logger.info("Create the database now");

        connection.query ('CREATE DATABASE IF NOT EXISTS ' + dbcfg.database );

        // create the users table, opt new users into data tracking by default
        Logger.info("Create the Table:", dbcfg.users_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.users_table + "( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            username VARCHAR(80) NOT NULL, \
            password CHAR(60) NOT NULL, \
            sessionId INT NOT NULL DEFAULT 0, \
            optedIn BOOL DEFAULT TRUE, \
            PRIMARY KEY(id) \
        )");

        // create the verify table; this used to temporarily store account
        // verification and password recovery information
        Logger.info("Create the Table:", dbcfg.verify_table);
        connection.query("CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.verify_table + "( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            type VARCHAR(10) NOT NULL, \
            token VARCHAR(40) UNIQUE NOT NULL, \
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
            FOREIGN KEY (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            PRIMARY KEY(id) \
        )");

        // create the user_registration table; this is used to keep track of
        // whether or not a user has completed and verified their registration
        Logger.info("Create the Table:", dbcfg.user_registration_table);
        connection.query("CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.user_registration_table + "( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            isRegistered BOOL DEFAULT FALSE, \
            completedSetup BOOL DEFAULT FALSE, \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            PRIMARY KEY(id) \
        )");

        // survey table
        Logger.info("Create the Table:", dbcfg.survey_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.survey_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            surveyName VARCHAR(60) UNIQUE NOT NULL, \
            authorNames VARCHAR(60) NOT NULL, \
            title VARCHAR(60), \
            totalQuestions INT, \
            surveyField VARCHAR(40) NOT NULL, \
            surveyFreq VARCHAR(20) NOT NULL, \
            fullSurveyFile VARCHAR(80) NOT NULL, \
            PRIMARY KEY(id) \
        )");
        
        // survey results table; foreign keys in survey and users tables
        Logger.info("Create the Table:", dbcfg.survey_results_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.survey_results_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            surveyId Int UNSIGNED NOT NULL, \
            userId INT UNSIGNED NOT NULL, \
            questionId VARCHAR(20) NOT NULL, \
            questionAnswer VARCHAR(80) NOT NULL, \
            surveyResponseId INT NOT NULL DEFAULT 0, \
            answeredOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (surveyId) REFERENCES " + dbcfg.database + "." +dbcfg.survey_table + "(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id) \
        )");

        // survey preferences table; foreign keys in user and survey tables
        Logger.info("Create the Table:", dbcfg.survey_preferences_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.survey_preferences_table + " ( \
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
            FOREIGN Key (surveyId) REFERENCES " + dbcfg.database + "." + dbcfg.survey_table + "(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            UNIQUE Key survey_userIds (surveyId,userId) \
        )");

        // survey question table; foreign key in survey_table
        Logger.info("Create the Table:", dbcfg.question_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.question_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            surveyId Int UNSIGNED NOT NULL, \
            language CHAR(10) NOT NULL, \
            origOrder INT UNSIGNED NOT NULL, \
            text TEXT NOT NULL, \
            visualFile Text, \
            type ENUM ('matrix','rating','text','radiogroup') NOT NULL, \
            PRIMARY KEY(id), \
            FOREIGN Key (surveyId) REFERENCES " + dbcfg.database + "." +dbcfg.survey_table + "(id) \
        )");

        // user interaction table; foreign key in users table;
        Logger.info("Create the Table:", dbcfg.users_interation_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.users_interation_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL, \
            eventType VARCHAR(40) NOT NULL, \
            name VARCHAR(40) NOT NULL, \
            data TEXT NOT NULL, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id) \
        )");

        // submission table; foreign key in users table
        Logger.info("Create the Table:", dbcfg.submission_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.submission_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL DEFAULT 0, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id) \
        )");

        // feedback table; foreign key in users and submission tables
        Logger.info("Create the Table:", dbcfg.feedback_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.feedback_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL DEFAULT 0, \
            submissionId INT UNSIGNED NOT NULL, \
            toolName TEXT NOT NULL, \
            filename TEXT NOT NULL, \
            runType TEXT NOT NULL, \
            type TEXT NOT NULL, \
            route TEXT, \
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
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            FOREIGN Key (submissionId) REFERENCES " + dbcfg.database + "." + dbcfg.submission_table + "(id) \
        )");

        // feedback stats table; foreign keys in user and submission tables
        Logger.info("Create the Table:", dbcfg.feedback_stats_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.feedback_stats_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL DEFAULT 0, \
            submissionId INT UNSIGNED NOT NULL, \
            filename TEXT NOT NULL, \
            toolName TEXT NOT NULL, \
            name TEXT NOT NULL, \
            type TEXT NOT NULL, \
            level TEXT NOT NULL, \
            category TEXT NOT NULL, \
            statName TEXT NOT NULL, \
            statValue DECIMAL(8,3), \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            FOREIGN Key (submissionId) REFERENCES " + dbcfg.database + "." + dbcfg.submission_table + "(id) \
        )");

        // feedback interaction table; foreign keys in user, submission, and
        // feedback tables
        Logger.info("Create the Table:", dbcfg.feedback_interaction_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.feedback_interaction_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            sessionId INT UNSIGNED NOT NULL DEFAULT 0, \
            submissionId INT UNSIGNED NOT NULL, \
            feedbackId INT UNSIGNED NOT NULL, \
            action TEXT NOT NULL, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            FOREIGN Key (submissionId) REFERENCES " + dbcfg.database + "." + dbcfg.submission_table + "(id), \
            FOREIGN Key (feedbackId) REFERENCES " + dbcfg.database + "." + dbcfg.feedback_table + "(id) \
        )");
        
        Logger.info("Create the Table:", dbcfg.feedback_rating_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.feedback_rating_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            feedbackId INT UNSIGNED NOT NULL, \
            ratingUp int UNSIGNED  NOT NULL, \
            ratingDown int UNSIGNED  NOT NULL, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            FOREIGN Key (feedbackId) REFERENCES " + dbcfg.database + "." + dbcfg.feedback_table + "(id) \
        )");

        Logger.info("Create the Table:", dbcfg.feedback_input_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.feedback_input_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            feedbackId INT UNSIGNED NOT NULL, \
            input TEXT NOT NULL, \
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            FOREIGN Key (feedbackId) REFERENCES " + dbcfg.database + "." + dbcfg.feedback_table + "(id) \
        )");

        // student table; used for user profiles; foreign key in users table
        Logger.info("Create the Table:", dbcfg.student_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.student_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            name TEXT, \
            bio TEXT, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id) \
        )");

        // class table
        Logger.info("Create the Table:", dbcfg.class_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.class_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            code VARCHAR(40) UNIQUE NOT NULL, \
            name TEXT, \
            description TEXT, \
            disciplineType ENUM ('computer science','psychology', 'other'), \
            PRIMARY KEY(id) \
        )");

        // student class table; associates students with classes
        Logger.info("Create the Table:", dbcfg.student_class_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.student_class_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            studentId INT UNSIGNED NOT NULL, \
            classId INT UNSIGNED NOT NULL, \
            PRIMARY KEY(id), \
            FOREIGN Key (studentId) REFERENCES " + dbcfg.database + "." + dbcfg.student_table + "(id), \
            FOREIGN Key (classId) REFERENCES " + dbcfg.database + "." + dbcfg.class_table + "(id) \
        )");


        // assignment table; foreign key in class table
        Logger.info("Create the Table:", dbcfg.assignment_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.assignment_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            classId INT UNSIGNED NOT NULL, \
            name TEXT, \
            title TEXT, \
            description TEXT, \
            deadline DATETIME DEFAULT CURRENT_TIMESTAMP , \
            PRIMARY KEY(id), \
            FOREIGN Key (classId) REFERENCES " + dbcfg.database + "." + dbcfg.class_table + "(id) \
        )");

        // assignment task table; foreign key in assignment table
        Logger.info("Create the Table:", dbcfg.assignment_task_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.assignment_task_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            assignmentId INT UNSIGNED NOT NULL, \
            name TEXT, \
            description TEXT, \
            PRIMARY KEY(id), \
            FOREIGN Key (assignmentId) REFERENCES " + dbcfg.database + "." + dbcfg.assignment_table + "(id) \
        )");

        /// Student Assignment Task is student's own rating of tasks completed.
        Logger.info("Create the Table:", dbcfg.student_assignment_task_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.student_assignment_task_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            studentId INT UNSIGNED NOT NULL, \
            assignmentTaskId INT UNSIGNED NOT NULL, \
            isComplete BOOL NOT NULL DEFAULT 0, \
            PRIMARY KEY(id), \
            FOREIGN Key (studentId) REFERENCES " + dbcfg.database + "." + dbcfg.student_table + "(id), \
            FOREIGN Key (assignmentTaskId) REFERENCES " + dbcfg.database + "." + dbcfg.assignment_task_table + "(id), \
            UNIQUE Key student_assignmentId (studentId,assignmentTaskId) \
        )");

        // Stores only current value of preferences, interactions and changes
        // are captured else where
        Logger.info("Create the Table:", dbcfg.preferences_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.preferences_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            toolType VARCHAR(60) NOT NULL, \
            toolName VARCHAR(60) NOT NULL, \
            toolValue TEXT NOT NULL, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            UNIQUE Key userTool (userId,toolName) \
        )");

        // upcoming event table; events are associated with classes
        Logger.info("Create the Table:", dbcfg.upcoming_event_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.upcoming_event_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            classId INT UNSIGNED NOT NULL, \
            name TEXT, \
            title TEXT, \
            description TEXT, \
            openDate DATETIME DEFAULT CURRENT_TIMESTAMP, \
            closedDate DATETIME DEFAULT CURRENT_TIMESTAMP, \
            dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (classId) REFERENCES " + dbcfg.database + "." + dbcfg.class_table + "(id) \
        )");

        // Class skill can be associated with a specific assignment or not
        Logger.info("Create the Table:", dbcfg.class_skill_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.class_skill_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            classId INT UNSIGNED NOT NULL, \
            assignmentId INT UNSIGNED NULL, \
            name TEXT, \
            description TEXT, \
            PRIMARY KEY(id), \
            FOREIGN Key (classId) REFERENCES " + dbcfg.database + "." + dbcfg.class_table + "(id), \
            FOREIGN Key (assignmentId) REFERENCES " + dbcfg.database + "." + dbcfg.assignment_table + "(id) \
        )");

        // Skills as rated by the student
        Logger.info("Create the Table:", dbcfg.student_skill_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.student_skill_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            studentId INT UNSIGNED NOT NULL, \
            classSkillId INT UNSIGNED, \
            value DECIMAL(4,2), \
            lastRated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
            PRIMARY KEY(id), \
            FOREIGN Key (studentId) REFERENCES " + dbcfg.database + "." + dbcfg.student_table + "(id), \
            FOREIGN Key (classSkillId) REFERENCES " + dbcfg.database + "." + dbcfg.class_skill_table + "(id) \
        )");

        // Roles Tables (student,instructor, owner...etc)
        Logger.info("Create the Table:", dbcfg.role_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.role_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            role VARCHAR(40) NOT NULL DEFAULT \"student\", \
            PRIMARY KEY(id) \
        )");

        Logger.info("Create the Table:", dbcfg.user_role_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.user_role_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            userId INT UNSIGNED NOT NULL, \
            roleId INT UNSIGNED NOT NULL, \
            PRIMARY KEY(id), \
            FOREIGN Key (userId) REFERENCES " + dbcfg.database + "." + dbcfg.users_table + "(id), \
            FOREIGN Key (roleId) REFERENCES " + dbcfg.database + "." + dbcfg.role_table + "(id) \
        )");

        Logger.info("Create the Table:", dbcfg.ifs_tips_table);
        connection.query(" CREATE TABLE IF NOT EXISTS " + dbcfg.database + "." + dbcfg.ifs_tips_table + " ( \
            id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
            name TEXT, \
            description TEXT, \
            PRIMARY KEY(id) \
        )");

        Logger.info("Success: Database created.");

        /* POST DATABASE CREATION SITE CONFIGURATION */
        // set up the default roles of 'admin', 'developer', and 'student';
        // these represent privileged users who can modify classes and
        // assignments, ????, and normal students
        Logger.info("Set up roles in:", dbcfg.role_table);
        connection.query("INSERT INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (1, \"admin\") ON DUPLICATE KEY UPDATE id=id;");
        connection.query("INSERT INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (2, \"developer\") ON DUPLICATE KEY UPDATE id=id;");
        connection.query("INSERT INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (3, \"student\") ON DUPLICATE KEY UPDATE id=id;");

        /* POST DATABASE CREATION: setup deletion rules for entries in the
         * verify_table; run once per hour */
        Logger.info("Set up event for expired token management.");
        Logger.info("PLEASE ENSURE THAT GLOBAL event_scheduler=1 IS SET FOR SERVER.");
        connection.query("create event if not exists " + dbcfg.database + ".clearExpired\
            ON SCHEDULE EVERY 1 HOUR\
            DO DELETE FROM " + dbcfg.database + "." + dbcfg.verify_table + "\
            WHERE TIMESTAMPDIFF(HOUR, " + dbcfg.database + "." + dbcfg.verify_table + ".timestamp, NOW()) > 12 AND type='reset';"
        );
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
