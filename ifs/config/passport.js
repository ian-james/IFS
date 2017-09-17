var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('./database');
var dbHelpers = require(__components + "Databases/dbHelpers");
var dbcfg = require(__configs + 'databaseConfig');

var validator = require('validator');
var sanitization = require(__configs + 'sanitization');

var nodemailer = require('nodemailer');
var mailcfg = require(__configs + 'mailConfig');
var tokgen = require('tokgen');
var verifySend = require(__components + "Verify/verifySend");

var path = require('path');
var mkdirp = require('mkdirp');
var cp = require('cp-file');
var Logger = require( path.join( __dirname, "/loggingConfig") );

var SurveyBuilder = require( __components + "Survey/surveyBuilder");
var preferencesDB = require( __components + "Preferences/preferenceDB.js");
var studentProfile = require(__components + "StudentProfile/studentProfileDB")

var defaultTool = require( __components + "Preferences/setupDefaultToolType.js");

module.exports = function (passport) {
    // TODO: Default ToolType is should be set somewhere else with greater visbility.
    var defaultToolType = "Programming";
    var toolTypeKey = "pref-toolSelect";
    var prefToolType = "Option";

    passport.serializeUser ( function(user,done) {
        done(null,  { 'id': user.id, 'sessionId': user.sessionId } );
    });

    passport.deserializeUser( function(user,done) {
        db.query( "SELECT id, username, sessionId FROM users where id = ? ", user.id, function(err,rows) {
            done( err, rows[0]);
        });
    });

    // This is the initialized of the local-signup strategy used by passport, it calls this callback upcon
    // an attempted signup, basically just hashes password and tries to insert new user.
    passport.use('local-signup',
        new LocalStrategy(
            {
                firstnameField: 'firstname',
                lastnameField: 'lastname',
                usernameField: 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function(req, username, password, done) {
                var firstname = req.body['firstname'];
                var lastname = req.body['lastname'];

                // validate inputs
                if (!validator.isEmail(username)) {
                    req.flash('errorMessage', 'Error. You must use a valid email address.');
                    return done(null, false);
                } else {
                    username = validator.normalizeEmail(username);
                    if(!sanitization.validateGuelphEmail(username)) {
                        req.flash('errorMessage', 'Error. You must use a valid University of Guelph email address.');
                        return done(null, false);
                    }
                }
                if (!sanitization.validateText(firstname, 'title')) {
                    req.flash('errorMessage', 'Illegal characters in first name.');
                    return done(null, false);
                }
                if (!sanitization.validateText(lastname, 'title')) {
                    req.flash('errorMessage', 'Illegal characters in last name.');
                    return done(null, false);
                }

                // inputs validated, now double check that the user does not already exist
                db.query("SELECT * FROM users WHERE username = ?", username, function(err,rows) {
                    if (err) {
                        req.flash('errorMessage', 'Unable to signup.');
                        Logger.error(err);
                        return done(err);
                    }
                    if (rows.length) {
                        Logger.info("Attempt to register new account with existing email was just made.", rows[0]);
                        req.flash('errorMessage', 'Error. A user already exists with that email address.');
                        return done(null, false);
                    } else {
                        Logger.info("Adding new user");
                        var newUser = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)
                        };

                        // set up new user
                        var newuserQuery = "INSERT INTO users (username, password) values (?,?)";
                        db.query(newuserQuery,[newUser.username, newUser.password], function(err,rows) {
                            if (err)
                                Logger.log("ERROR", err);

                            newUser.id = rows.insertId;

                            // copy the default avatar to the user avatar
                            var imgpath = "./app/shared/img/user/";
                            var defaultpath = imgpath + "avatar_default.png";
                            var avatarpath = imgpath + newUser.id + "/";
                            mkdirp(avatarpath, function(err) {
                                if (err) {
                                    Logger.error("Unable to create image folder.");
                                }
                            });
                            cp.sync(defaultpath, avatarpath + "avatar.png");

                            // set up profile and survey settings
                            studentProfile.insertStudentProfile(newUser.id, firstname + " " + lastname, "", function(profileErr, studentSet) {
                                preferencesDB.setStudentPreferences(newUser.id, prefToolType, toolTypeKey, defaultToolType, function(prefErr, prefData){
                                    defaultTool.setupDefaultTool(req);
                                    SurveyBuilder.setSignupSurveyPreferences(newUser.id, function(err,data){
                                        // generate verification token (and insert it into the database) and send email
                                        verifySend.generateLink('verify', newUser.id, function(err, link) {
                                            if (err)
                                                Logger.error(err);
                                            if (link) {
                                                var message = 'Please follow the link below to complete your account registration:';
                                                var subject = "Complete your registration";
                                                verifySend.sendLink(newUser.username, link, subject, message);

                                                newUser.sessionId = 0;
                                                req.flash('success', 'Check your email for a verification link.');
                                            }
                                            return done(null, newUser);
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            }
        )
    );

    // This is the initialization of the local-login strategy used by passport, it calls this callback upon
    // an attempted login, basically a simple check to see if user exists.
    passport.use('local-login',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function (req, username, password, done) {
                if (!validator.isEmail(username)) {
                    req.flash('errorMessage', 'Error. You must use a valid email address.');
                    return done(null, false);
                } else {
                    username = validator.normalizeEmail(username);
                }

                // TODO: verify the isRegistered boolean in user_registration
                db.query("SELECT * FROM users WHERE username = ?", username, function(err,rows) {
                    if (err) {
                        req.flash('errorMessage', 'Service currently unavailable');
                        return done(err, false);
                    }
                    if (!rows.length) {
                        req.flash('errorMessage', 'Incorrect username or password');
                        return done( null, false);
                    }
                    if (!bcrypt.compareSync(password, rows[0].password)){
                        req.flash('errorMessage', 'Incorrect username or password');
                        return done( null, false);
                    }
                    // verify the user has completed registration
                    var uid = rows[0].id;
                    var isreg = dbHelpers.buildSelect(dbcfg.user_registration_table) + dbHelpers.buildWhere(["userId"]);
                    db.query(isreg, uid, function(err, data) {
                        if (err)
                            Logger.error(err);
                        if (!data[0]) {
                            req.flash('errorMessage', 'Check your email to complete registration.');
                            return done(null, false);
                        }
                    });

                    // Increment sessionId for user
                    db.query(dbHelpers.buildUpdate(dbcfg.users_table) +  " set sessionId = sessionId+1 WHERE id = ?", rows[0].id, function(err,rows) {
                        if (err)
                            Logger.error(err);
                    });

                    // Increment local copy, instead of reading from DB.
                    rows[0].sessionId += 1;

                    //Set a single preference on login to load their toolType preferences (defaults to programming)
                    preferencesDB.getStudentPreferencesByToolName(rows[0].id,  toolTypeKey, function(toolErr, result) {
                        if (toolErr || !result || result.length == 0)
                            defaultTool.setupDefaultTool(req);
                        else
                            defaultTool.setupDefaultTool(req, result[0].toolValue);

                        return done(null, rows[0]);
                    });
                });
            }
        )
    );
};
