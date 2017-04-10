var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var db = require('./database');

var path = require('path');
var Logger = require( path.join( __dirname, "/loggingConfig") );

var SurveyBuilder = require( __components + "Survey/surveyBuilder");

module.exports = function (passport) {

    passport.serializeUser ( function(user,done) {
        done(null, user.id);
    });

    passport.deserializeUser( function(id,done) {
        db.query( "SELECT * FROM users where id = ? ", [id], function(err,rows) {
            done( err, rows[0]);
        });
    });

    // This is the initialized of the local-signup strategy used by passport, it calls this callback upcon
    // an attempted signup, basically just hashes password and tries to insert new user.
    passport.use( 'local-signup',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function (req, username, password, done ) {

                db.query("SELECT * FROM users WHERE username = ?", [username], function(err,rows) {
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
                            req.flash('success', 'Successfully signed up.');
                            SurveyBuilder.setSignupSurveyPreferences(newUser.id, function(err,data){
                                return done(null, newUser);
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

                db.query("SELECT * FROM users WHERE username = ?", [username], function(err,rows) {
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

                    return done(null, rows[0]);
                });
            }
        )
    );
};
