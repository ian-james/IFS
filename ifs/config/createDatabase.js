var mysql = require('mysql');
var dbconfig = require('./database');

var connection = mysql.createConnection( dbconfig.connection );

// Tell mysql to use the database
console.log("Create the database now");
connection.query ('CREATE DATABASE ' + dbconfig.database );

console.log("Create the Table now");
connection.query(" CREATE TABLE " + dbconfig.database + "." + dbconfig.users_table + " ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    username VARCHAR(20) NOT NULL, \
    password CHAR(60) NOT NULL, \
    PRIMARY KEY(id) \
)");

console.log("Success: Database created.");

connection.end();