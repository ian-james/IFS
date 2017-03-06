var mysql = require('mysql');
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');

// Path and file management
var path = require('path');
var viewPath = path.join( __dirname + "/");

var Logger = require( __configs + "loggingConfig");


function insertRawFeedback( req, res, tools, result ) {
    if( req.user &&  req.user.username ) 
    {
        // Store the result in a database and move on
        var user = req.user.username;
        var insertReq = "INSERT INTO " + config.raw_feedback_table + " (username, tools, feedback) values (?, ?, ?)";
        try
        {
            db.query(insertReq,[user, JSON.stringify(tools), JSON.stringify(result.allFeedbackFile)], function(err,data){
                
                if( err ) {
                    Logger.debug("Error inserting raw feedback");
                }
                res.redirect('/feedback');
            });
        }
        catch (e) {
        }
    }
    else
    {
        res.redirect('/feedback');
    }
}

module.exports.addRawFeedbackToDB = insertRawFeedback;
