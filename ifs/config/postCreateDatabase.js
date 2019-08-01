// postDatabaseCreate script.
// Run Knex migration before this file to setup tables as needed.
// PostDatabase script should be run after to setup events and default table values


var mysql = require('mysql');
var dbcfg = require('./databaseConfig');
var dbConnect = require('./dbConnectionConfig.js')

var Logger = require('./loggingConfig') ;
var _ = require('lodash');
var async = require('async');

var accounts = require('./defaultAccounts.js').accounts;

try {
    console.log("Post Database setup, making a connection ...")
    var connection = mysql.createConnection( dbConnect.connection );
    console.log("Database connected successful.")

    // Tell mysql to use the database
    if(connection) {
        Logger.log("Post-Database creation script is running.")

        /* POST DATABASE CREATION SITE CONFIGURATION */

        // Create a couple default accounts that are already registered.
        // N.B. First time IFS developers should double check these accounts created properly.
        _.forEach( accounts, function( account) {

            // set up the default roles of 'admin', 'developer', and 'student';
            connection.query("INSERT IGNORE INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (" + account.roleId + ",\"" + account.role + "\")");

            // Setup several default users for each account role.
            connection.query("INSERT IGNORE INTO " +  dbcfg.database + "." + dbcfg.users_table + "(id, username, password) VALUES (" + account.userId + ", \"" + account.email + "\", \"" + account.password + "\") ");

            // Register each user
            connection.query("INSERT IGNORE INTO " +  dbcfg.database + "." + dbcfg.user_registration_table + "(userId, isRegistered) VALUES (\"" + account.userId + "\", 1 ) ");

            // Setup the user's role after registration.
            connection.query("INSERT IGNORE INTO " +  dbcfg.database + "." + dbcfg.user_role_table + "(userID, roleId) VALUES (" + account.userId + "," + account.roleId + ") ");

            // Add an empty student account for the registered student.
            connection.query("INSERT IGNORE INTO " +  dbcfg.database + "." + dbcfg.student_table + "(userId) VALUES (" + account.userId + " ) ");

            // Other default setting might be necessary like survey.
        });

        /* POST DATABASE CREATION: setup deletion rules for entries in the
         * verify_table; run once per hour */
        Logger.info("Set up event for expired token management.");
        Logger.info("PLEASE ENSURE THAT GLOBAL event_scheduler=1 IS SET FOR SERVER.");
        connection.query("create event if not exists " + dbcfg.database + ".clearExpired\
            ON SCHEDULE EVERY 1 HOUR\
            DO DELETE FROM " + dbcfg.database + "." + dbcfg.verify_table + "\
            WHERE TIMESTAMPDIFF(HOUR, " + dbcfg.database + "." + dbcfg.verify_table + ".timestamp, NOW()) > 12 AND type='reset';"
        );

        Logger.log("Post-Database creation script is finished successfully.")
    } else {
        Logger.error("Error, Unable to make connection to post-setup database")
    }
    //
    // end the connection; this was outside of the relevant scope before; can
    // you end a connection that failed?``
    connection.end();
} catch(e) {
    Logger.error("Error: Unable to setup post database events.");
}