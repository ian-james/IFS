var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('./database');
var dbHelpers = require(__components + "Databases/dbHelpers");
var config = require(__configs + 'databaseConfig');

var path = require('path');
var mkdirp = require('mkdirp');
var cp = require('cp-file');
var Logger = require( path.join( __dirname, "/loggingConfig") );

var SurveyBuilder = require( __components + "Survey/surveyBuilder");
var preferencesDB = require( __components + 'Preferences/preferenceDB.js');
var studentProfile = require(__components + "StudentProfile/studentProfileDB")

var defaultTool = require( __components + 'Preferences/setupDefaultToolType.js');

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
    passport.use( 'local-signup',
        new LocalStrategy(
            {
                /*
                 * The first and last name fields are not currently being used
                 * by the sign-up form. How can we make use of them?
                 */
                firstnameField: 'firstname',
                lastnameField: 'lastname',
                usernameField: 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function (req, username, password, done ) {

                db.query("SELECT * FROM users WHERE username = ?", username, function(err,rows) {
                    //req.flash('errorMessage', 'We tried');
                    if(err)
                    {
                        req.flash('errorMessage', 'Unable to signup.');
                        Logger.error( err );
                        return done(err);
                    }

                    if(rows.length) {
                        Logger.info(" Didn't find authorization", rows[0]);
                        req.flash('errorMessage', 'That user is already taken');
                        return done( null, false );
                    }
                    else{
                        Logger.info("Adding new user");
                        var newUser = {
                            username: username,
                            password: bcrypt.hashSync( password, null, null )
                        };

                        var insertQuery = "INSERT INTO users (username, password) values (?,?)";
                        db.query( insertQuery,[newUser.username, newUser.password], function(err,rows) {
                            newUser.id = rows.insertId;

                            // copy the default avatar to the user avatar
                            var imgpath = "./app/shared/img/user/";
                            var defaultpath = imgpath + "avatar_default.png";
                            var avatarpath = imgpath + newUser.id + "/";
                            mkdirp(avatarpath, function(err) {
                                if(err) {
                                    Logger.error("Unable to create image folder.");
                                }
                            });
                            cp.sync(defaultpath, avatarpath + "avatar.png");


                            newUser.sessionId = 0;
                            req.flash('success', 'Successfully signed up.');

                            //Load Preferences
                            console.log("INSERTING DATA TO STUDENT PROFILE");

                            /*
                             *
                             * TODO: pass firstname/lastname fields from sign up form to the studentProfile SQL DB
                             *
                             */

                            studentProfile.insertStudentProfile( newUser.id, "Student", "Tell us about yourself", "defaultImg.png", function(profileErr, studentSet) {
                                preferencesDB.setStudentPreferences( newUser.id, prefToolType, toolTypeKey, defaultToolType, function( prefErr, prefData ){
                                    SurveyBuilder.setSignupSurveyPreferences(newUser.id, function(err,data){
                                        return done(null, newUser);
                                    });
                                });
                            });
                        });
                    }
                });
            }
        )
    );

    // This is the initialized of the local-login strategy used by passport, it calls this callback upcon
    // an attempted login, basically a simple check to see if user exists.
    passport.use( 'local-login',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function (req, username, password, done ) {

                db.query("SELECT * FROM users WHERE username = ?", username, function(err,rows) {
                    if(err) {
                        req.flash('errorMessage', 'Service currently unavailable');
                        return done(err, false);
                    }
                    if(!rows.length) {
                        req.flash('errorMessage', 'Incorrect username or password');
                        return done( null, false);
                    }
                    if( !bcrypt.compareSync(password, rows[0].password)){
                        req.flash('errorMessage', 'Incorrect username or password');
                        return done( null, false);
                    }

                    // Increment sessionId for user
                    db.query(dbHelpers.buildUpdate(config.users_table) +  " set sessionId = sessionId+1 WHERE id = ?", rows[0].id, function(err,rows) {
                        if(err)
                            Logger.error( err );
                    });

                    // Increment local copy, instead of reading from DB.
                    rows[0].sessionId += 1;

                    //Set a single preference on login to load their toolType preferences (defaults to programming)
                    preferencesDB.getStudentPreferencesByToolName( rows[0].id,  toolTypeKey, function(toolErr, result){
                        if( toolErr || !result || result.length == 0)
                            defaultTool.setupDefaultTool(req);
                        else
                            defaultTool.setupDefaultTool(req, result[0].toolValue );

                        return done(null, rows[0]);
                    });
                });
            }
        )
    );
};
