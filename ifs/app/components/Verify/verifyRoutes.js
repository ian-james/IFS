var path = require('path');
var viewPath = path.join(__dirname + "/");
var Logger = require(__configs + "loggingConfig");

var tokgen = require('tokgen');
var mailcfg = require(__configs + "mailConfig");
var passport = require(__configs + "passport");

var config = require(__configs + "databaseConfig");
var db = require(__configs + "database");
var dbHelpers = require(__components + "Databases/dbHelpers");

var fs = require('fs');

module.exports = function(app) {

    // this route is for checking url parameters, intended to verify an emailed
    // id/token pair sent after account registration
    app.route("/verify")

    .get(function(req,res,next) {
        let title = "Account Verification";
        let success = "Successfully verified your account! Please login.";
        let error = "Your account could not be verified. Please contact support.";
        let regd = "You are already registered! If you think this is an error, contact support.";
        var uid = req.query.id;
        var tok = req.query.t;
        tok = tok.replace(/\W/g, ''); // ensure alphanumeric
        let debug = "uid: "+ uid + ", token: " + tok;

        if (isNaN(uid))
            res.render(viewPath + "verify", { title: 'Account Verification', message: error});

        // look up the uid and compare it with the token
        var q = dbHelpers.buildSelect(config.verify_table) + dbHelpers.buildWhere(['userId', 'type']);
        db.query(q, [uid, 'verify'], function(err, data) {
            if (data[0])
                var lookup = data[0].token;
            else {
                res.render(viewPath + "verify", { title: 'Account Verification', message: error + " (1)"});
            }
            if (!lookup || lookup != tok) {
                console.log("ERROR TOKENS DO NOT MATCH");
                res.render(viewPath + "verify", { title: 'Account Verification', message: error + " (2)"});
                res.end();
            } else { // looked up correct account, now complete registration and remove entry from verify table
                // check not already registered
                var check = dbHelpers.buildSelect(config.user_registration_table) + dbHelpers.buildWhere(['userId']);
                db.query(check, [uid], function(err, data) {
                    console.log("DATA:", JSON.stringify(data));
                    if (data[0]) {
                        console.log("USER ALREADY REGISTERED.");
                        res.render(viewPath + "verify", { title: 'Account Verification', message: regd + " (3)"});
                        res.end();
                    } else {
                        var reg = dbHelpers.buildInsert(config.user_registration_table) + dbHelpers.buildValues(["userId", "isRegistered"]);
                        db.query(reg, [uid, 1], function(err, data) {
                            if (err) {
                                res.render(viewPath + "verify", { title: 'Account Verification', message: error + " (4)"});
                                console.log("ERROR", JSON.stringify(err));
                                return;
                            } else {
                                var del = dbHelpers.buildDelete(config.verify_table) + dbHelpers.buildWhere(["userId", "type"]);
                                db.query(del, [uid, "verify"], function(err, data) {
                                    if (err) {
                                        res.render(viewPath + "verify", { title: 'Account Verification', message: error + " (5)"});
                                        console.log("ERROR", JSON.stringify(err));
                                        return;
                                    } else {
                                        res.render(viewPath + "verify", { title: 'Account Verification', message: success});
                                        return;
                                    }
                                });
                            }
                        });
                    }
                });
            }
            //res.render(viewPath + "verify", { title: 'Account Verification', message: debug});
        });

    });

    // this route is for checking url parameters, intended to verify an emailed
    // id/token pair sent after a user requests to reset their password
    // once the id/token pair is validated, the password reset form will be shown
    app.route("/reset")

    .get(function(req,res,next) {
        res.render(viewPath + "reset", { title: 'Password Reset', message: 'ok'})
    });

    // this route is for registering a new token/id pair in the temporary database
    // and sending an email to the specified address
    app.route("/forgot")

    .get(function(req,res,next) {
        res.render(viewPath + "forgot", { title: 'Forgotten Password', message: 'ok'})
    });
}

