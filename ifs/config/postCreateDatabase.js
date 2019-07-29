// postDatabaseCreate script.
// Run Knex migration before this file to setup tables as needed.
// PostDatabase script should be run after to setup events and default table values


var mysql = require('mysql');
var dbcfg = require('./databaseConfig');
var dbConnect = require('./dbConnectionConfig.js')

var Logger = require('./loggingConfig') ;

try {
    console.log("Post Database setup, making a connection ...")
    var connection = mysql.createConnection( dbConnect.connection );
    console.log("Database connected successful.")

    // Tell mysql to use the database
    if(connection) {
        Logger.log("Post-Database creation script is running.")
        /* POST DATABASE CREATION SITE CONFIGURATION */
        // set up the default roles of 'admin', 'developer', and 'student';
        // these represent privileged users who can modify classes and
        // assignments, ????, and normal students
        Logger.info("Set up roles in:", dbcfg.role_table);
        connection.query("INSERT INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (1, \"admin\") ON DUPLICATE KEY UPDATE id=id;");
        connection.query("INSERT INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (2, \"developer\") ON DUPLICATE KEY UPDATE id=id;");
        connection.query("INSERT INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (3, \"instructor\") ON DUPLICATE KEY UPDATE id=id;");
        connection.query("INSERT INTO " + dbcfg.database + "." + dbcfg.role_table + "(id, role) VALUES (4, \"student\") ON DUPLICATE KEY UPDATE id=id;");

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