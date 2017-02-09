var mysql = require('mysql');
var db = require('../../../config/database');
var config = require('../../../config/databaseConfig');

// Path and file management
var path = require('path');
var viewPath = path.join( __dirname + "/");

// Function for setting up testing of feedback page.
function showTestFeedback( req,res,result )
{
    console.log("Render")
    res.render(viewPath + "feedbackWaiting", { title: 'Feedback', test:"Tester", result:result});
    res.end();
    console.log("ENDING");
}

function insertRawFeedback( req, res, tools, result ) {

    console.log("info insertingRawFeedback");
    var user  = (req.user && req.user.username) ? req.user.username : "tester";
    if(user)
    {                // Store the result in a database and move on
        var insertReq = "INSERT INTO " + config.raw_feedback_table + " (username, tools, feedback) values (?, ?, ?)";

        console.log("Attempt insert");
        console.log(user);
        console.log(JSON.stringify(tools));
        db.query(insertReq,[user, JSON.stringify(tools), JSON.stringify(result)], function(err,data){
            
            if( err ) {
                console.log("INSERT ERROR:", err );
            }
            console.log("INSERTED FEEDBACK");
            showTestFeedback(req,res,result);
        });
    }
    else
    {
        showTestFeedback(req,res,result);
    }
}

module.exports.addRawFeedbackToDB = insertRawFeedback;
