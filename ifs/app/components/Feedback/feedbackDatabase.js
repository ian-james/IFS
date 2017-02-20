var mysql = require('mysql');
var db = require( __configs + 'database');
var config = require(__configs + 'databaseConfig');

// Path and file management
var path = require('path');
var viewPath = path.join( __dirname + "/");

var Logger = require( __configs + "loggingConfig");

// Function for setting up testing of feedback page.
function showTestFeedback( req,res,result )
{
    // Create  a session variable for the most recent name of the files
    // A file is
    req.session.feedbackFiles = result.feedbackFiles;
    return res.redirect('/feedback');
}

/* 
    Inserts information into the rawFeedback database
    Currently inserts the filename of feedback
*/

function insertRawFeedback( req, res, tools, result ) {
    var user  = (req.user && req.user.username) ? req.user.username : "tester";
    if( user)
    {                
        // Store the result in a database and move on
        var insertReq = "INSERT INTO " + config.raw_feedback_table + " (username, tools, feedback) values (?, ?, ?)";
        try
        {
            db.query(insertReq,[user, JSON.stringify(tools), JSON.stringify(result.feedbackFiles)], function(err,data){
                
                if( err ) {
                    Logger.debug("Error inserting raw feedback");
                }
                showTestFeedback(req,res,result);
            });
        }
        catch (e) {
        }
    }
    else
    {
        showTestFeedback(req,res,result);
    }
}

module.exports.addRawFeedbackToDB = insertRawFeedback;
