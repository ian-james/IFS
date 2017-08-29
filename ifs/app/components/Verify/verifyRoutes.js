var path = require('path');
var viewPath = path.join(__dirname + "/");
var Logger = require(__configs + "loggingConfig");

var bcrypt = require('bcrypt-nodejs');
var tokgen = require('tokgen');
var nodemailer = require('nodemailer');
var mailcfg = require(__configs + "mailConfig");
var passport = require(__configs + "passport");

var config = require(__configs + "databaseConfig");
var db = require(__configs + "database");
var dbHelpers = require(__components + "Databases/dbHelpers");

var fs = require('fs');

module.exports = function(app) {
    // this route is for registering a new token/id pair in the temporary database
    // and sending an email to the specified address
    app.get('/forgot', function(req,res,next) {
        // if user is logged in, do not allow access to this page
        if (req.user)
            res.render(viewPath + "forgot", { title: 'Oops!', error: 'You cannot access this page right now. Try again later.', success: false });
        else
            res.render(viewPath + "forgot", { title: 'Forgotten Password', error: false, success: false })
    });

    app.post('/forgot', function(req,res,next) {
        // lookup user by email
        var email = req.body.email;
        var q = dbHelpers.buildSelect(config.users_table) + dbHelpers.buildWhere(['username']);
        db.query(q, [email], function(err, data) {
            if (err) {
                Logger.error(err);
                res.render(viewPath + "forgot", { title: 'Forgotten Password', error: 'Error looking up email.', success: false })
            }
            if (!data[0]) {
                res.render(viewPath + "forgot", { title: 'Forgotten Password', error: "Error. Couldn't find an account with the provided email address.", success: false });
            } else {
                var uid = data[0].id; // get the user id from the database

                // check the database for a reset token
                var checkReset = dbHelpers.buildSelect(config.verify_table) + dbHelpers.buildWhere(["userId", "type"]);
                db.query(checkReset, [uid, "reset"], function(checkErr, checkData) {
                    // generate token
                    var generator = new tokgen();
                    var token = generator.generate();
                    // if the user already has a reset token, update it
                    if (checkData[0]) {
                        var update = dbHelpers.buildUpdate(config.verify_table) + ' SET token = ? ' + dbHelpers.buildWhere(['userId', 'type']);
                        db.query(update, [token, uid, 'reset'], function(updateErr, updateData) {
                            if (updateErr) {
                                console.log("ERROR", updateErr);
                                res.render(viewPath + "forgot", { title: 'Forgotten Password', error: "Error.", success: false });
                                return done(null, false);
                            }
                        });
                    } else {
                        // else insert token into the verify database
                        var insert = dbHelpers.buildInsert(config.verify_table) + dbHelpers.buildValues(["userId", "type", "token"]);
                        db.query(insert, [uid, "reset", token], function(verifyErr, verifyData){
                            if (verifyErr) {
                                console.log("ERROR", verifyErr);
                                res.render(viewPath + "forgot", { title: 'Forgotten Password', error: "Error.", success: false});
                                return done(null, false);
                            }
                        });
                    }

                    // send email
                    var link = 'http://' + mailcfg.host + '/reset?id=' + uid +'&t=' + token;
                    var msg = mailcfg.message;
                    msg['to'] = email;
                    msg['subject'] = "Reset your password";
                    var plainbody = "Someone requested a password change for your account at " + mailcfg.host + ".\n\nPlease follow the link below to reset your password:\n" + link + "\n\nNote that this link will expire in 12 hours.\n\nIf you did not request this change, you may ignore this email.";
                    msg['text'] = plainbody;
                    var transporter = new nodemailer.createTransport(mailcfg.transport_cfg);

                    transporter.sendMail(msg, (error, info) => {
                        if (error)
                            return console.log(error);
                        console.log('Message %s sent: %s', info.messageId, info.reponse);
                    });
                    res.render(viewPath + "forgot", { title: 'Forgotten Password', error: false, success: "Sucess! Please check your email for a password reset link." });
                });
            }
        });

    });

    // this route is for checking url parameters, intended to verify an emailed
    // id/token pair sent after a user requests to reset their password
    // once the id/token pair is validated, the password reset form will be shown
    app.get('/reset', function(req,res,next) {
        // do not allow client access to this page if user is logged in
        if (req.user) {
            res.render(viewPath + "forgot", { title: 'Oops!', error: 'You cannot access this page right now. Try again later.', success: false });
            return done(null, false);
        }

        // check url is in a valid format
        if (!req.query.id || !req.query.t) {
            res.render(viewPath + "reset", { title: 'Oops!', message: "Your verification link is invalid!"});
            return done(null, false);
        }

        let title = "Password Reset";
        let success = "Successfully reset your password! Please login.";
        let perror = "Your password could not be updated!.";
        let terror = "Unauthorized. Link is invalid or expired.";
        var uid = req.query.id;
        var tok = req.query.t;
        tok = tok.replace(/\W/g, ''); // ensure alphanumeric and underscores only
        let debug = "uid: " + uid + ", token: " + tok;

        if (isNaN(uid))
            res.render(viewPath + "reset", { title: title, message: error, valid: false });

        // look up the uid and compare it with the token
        var q = dbHelpers.buildSelect(config.verify_table) + dbHelpers.buildWhere(['userId', 'type']);
        db.query(q, [uid, 'reset'], function(err, data) {
            if (data[0])
                var lookup = data[0].token;
            else {
                res.render(viewPath + "reset", { title: title, message: error + " (1)"});
                res.end();
            }
            if (!lookup || lookup != tok) {
                console.log("ERROR TOKENS DO NOT MATCH");
                res.render(viewPath + "verify", { title: title, message: error + " (2)"});
                res.end();
            } else {
                // looked up correct account, now provide authorization to the application for password reset
                // application is given a copy of the uid and token, which are submitted with the form body;
                // this is used as additional verification that the procedure may continue when the form is posted
                res.render(viewPath + "reset", { title: title, message: 'Thanks for verifying your email! Use the form below to reset your password.', valid: true, token: tok, uid: uid });
            }
        });
    });

    app.post('/reset', function(req,res,next) {
        let title = "Password Reset";
        var email = req.body.username
        var passwd1 = req.body.password;
        var passwd2 = req.body.password_again;
        var uid = req.body.uid;
        var tok = req.body.tok;
        // sanity check: the user or something in the browser may have modified hidden inputs or otherwise found a way to submit malformed form data
        if (!email || !passwd1 || !passwd2 || !uid || isNaN(uid) || !tok) {
            res.render(viewPath + "reset", { title: title, message: 'Something went wrong with your form. Please try again using the link from your email. (6)', valid: false });
            res.end();
        }

        // verify that the user-inputted email matches the id supplied by the browser in the form
        var q = dbHelpers.buildSelect(config.users_table) + dbHelpers.buildWhere(['id', 'username']);
        db.query(q, [uid, email], function(err, data) {
            if (err) {
                Logger.error(err);
                res.render(viewPath + "reset", { title: title, message: "An internal error occurred. Please retry using the link from your email." + " (-1)", valid: false });
                res.end();
            }
            if (!data[0]) {
                console.log("USER SUPPLIED EMAIL DOES NOT MATCH ID (" + uid + ") FOR PASSWD RESET.");
                res.render(viewPath + "reset", { title: title, error: "Email does not match reset request. Did you make a typo?", valid: true, email: email, uid: uid, token: tok });

            }
        });

        // verify passwords are the same; if not, display error and return same information to the form
        // bug: this changes the displayed url in the browser, which might confuse a user. all necessary information is sent back to the form though.
        if (passwd1 != passwd2) {
            res.render(viewPath + "reset", { title: title, error: 'Passwords do not match. Try again.', valid: true, email: email, passwd: passwd1, uid: uid, token: tok });
            res.end();
        }

        // if we've made it this far, then we need to check that the link in the database still exists, then we can update the password.
        // this is done because of the asynchronous nature of this application... if multiple instances of this request exist in a browser, only one should be allowed to proceed; this check does not guarantee safety, but it mitigates risk
        var check = dbHelpers.buildSelect(config.verify_table) + dbHelpers.buildWhere(['userId', 'type']);
        db.query(check, [uid, 'reset'], function(err, data) {
            if (err) {
                Logger.error(err);
                res.render(viewPath + "reset", { title: title, message: "An internal error occurred. Please retry using the link from your email." + " (-1)", valid: false });
            }
            if (!data[0]) {
                res.status(403).render(viewPath + "reset", { title: title, message: "You are unauthorized to perform this action.", valid: false });
                res.end();
                return done(null, false);
            }
        });
        // now update password
        var password = bcrypt.hashSync(passwd1, null, null);

        var update = dbHelpers.buildUpdate(config.users_table) + ' SET password = ? ' + dbHelpers.buildWhere(['id', 'username']);
        db.query(update, [password, uid, email], function(err, data) {
            if (err) {
                Logger.error(err);
                res.render(viewPath + "reset", { title: title, message: "An internal error occurred. Please retry using the link from your email." + " (-1)", valid: false });
                res.end();
            }
            // remove the reset link from the datbase and alert the user of success
            var del = dbHelpers.buildDelete(config.verify_table) + dbHelpers.buildWhere(['userId', 'type', 'token']);
            db.query(del, [uid, 'reset', tok], function(err, data) {
                if (err) {
                    Logger.error(err);
                    res.render(viewPath + "reset", { title: title, message: "An internal error occurred. Please retry using the link from your email." + " (-1)", valid: false });
                    res.end();
                } else {
                    res.render(viewPath + "reset", { title: title, message: "Success! Your password was updated. You may now log in using your new password.", valid: false });
                    res.end();
                }
            });
        });

    });

    // this route is for checking url parameters, intended to verify an emailed
    // id/token pair sent after account registration
    app.route("/verify")
    .get(function(req,res,next) {
        // do not allow access to this page if a user is logged in
        if (req.user) {
            res.render(viewPath + "forgot", { title: 'Oops!', error: 'You cannot access this page right now. Try again later.', success: false });
            return done(null, false);
        }
        // check the link is in a valid format
        if (!req.query.id || !req.query.t) {
            res.render(viewPath + "verify", { title: 'Oops!', message: "Your verification link is invalid!"});
            return done(null, false);
        }

        let title = "Account Verification";
        let success = "Successfully verified your account! Please login.";
        let error = "Your account could not be verified. If you believe this is an error, please contact support.";
        let regd = "You are already registered! If you think this is an error, contact support.";
        var uid = req.query.id;
        var tok = req.query.t;
        tok = tok.replace(/\W/g, ''); // ensure alphanumeric and underscores
        let debug = "uid: "+ uid + ", token: " + tok;

        if (isNaN(uid))
            res.render(viewPath + "verify", { title: title, message: error});

        // look up the uid and compare it with the token
        var q = dbHelpers.buildSelect(config.verify_table) + dbHelpers.buildWhere(['userId', 'type']);
        db.query(q, [uid, 'verify'], function(err, data) {
            if (data[0])
                var lookup = data[0].token;
            else {
                res.render(viewPath + "verify", { title: title, message: error + " (1)"});
            }
            if (!lookup || lookup != tok) {
                console.log("ERROR TOKENS DO NOT MATCH");
                res.render(viewPath + "verify", { title: title, message: error + " (2)"});
                res.end();
            } else { // looked up correct account, now complete registration and remove entry from verify table
                // check not already registered
                var check = dbHelpers.buildSelect(config.user_registration_table) + dbHelpers.buildWhere(['userId']);
                db.query(check, [uid], function(err, data) {
                    if (err) {
                        Logger.error(err);
                        res.render(viewPath + "verify", { title: title, message: error + " (-1)"});
                        res.end();
                    }
                    console.log("DATA:", JSON.stringify(data));
                    if (data[0]) {
                        console.log("USER ALREADY REGISTERED.");
                        res.render(viewPath + "verify", { title: title, message: regd + " (3)"});
                        res.end();
                    } else {
                        var reg = dbHelpers.buildInsert(config.user_registration_table) + dbHelpers.buildValues(["userId", "isRegistered"]);
                        db.query(reg, [uid, 1], function(err, data) {
                            if (err) {
                                res.render(viewPath + "verify", { title: title, message: error + " (4)"});
                                console.log("ERROR", JSON.stringify(err));
                                return;
                            } else {
                                var del = dbHelpers.buildDelete(config.verify_table) + dbHelpers.buildWhere(["userId", "type"]);
                                db.query(del, [uid, "verify"], function(err, data) {
                                    if (err) {
                                        res.render(viewPath + "verify", { title: title, message: error + " (5)"});
                                        console.log("ERROR", JSON.stringify(err));
                                        return;
                                    } else {
                                        res.render(viewPath + "verify", { title: title, message: success});
                                        return;
                                    }
                                });
                            }
                        });
                    }
                });
            }
            //res.render(viewPath + "verify", { title: title, message: debug});
        });
    });
}

