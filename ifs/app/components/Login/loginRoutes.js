/*
  Modified from Barrett Harber's work on node-express-passport-mysql GitHub.
*/

var router = require('express').Router();
var path = require('path');
var viewPath = path.join( __dirname + "/");
var Logger = require(__configs + "loggingConfig");

var dbcfg = require(__configs + "databaseConfig");
var db = require(__configs + "database");
var dbHelpers = require(__components + "Databases/dbHelpers");

var _ = require('lodash');

module.exports = function( app, passport ) {
    function isAuthenticated(req,res,next) {
        var nonSecurePaths = ['/', '/login', '/register', '/verify', '/forgot', '/reset', '/about','/about/data'];
        var result = _.findIndex(nonSecurePaths, function (p) { return p == req.path});

        if(result >= 0 || (req.user) ) {
            if(req.user)
                res.locals.user = req.user;
            next();
        }
        else {
            res.redirect('/login');
        }
    }


    function getEmailUsername( email ) {

        if( email ) {
            var esplits = email.split('@');
            if( esplits.length == 2 )
            {
                var userId = esplits[0];
                return userId;
            }
        }
        return "";
    }

    // Call Authenticate before every function
    app.use( isAuthenticated );

    // Function to provide login Information to Angular
    app.get('/user/data', function(req,res) {
        if( req && req.user  )
            return res.status(200).json( {user: req.user.username} );
        return res.status(400);
    });

    app.get('/', function(req,res) {
        if(req && req.user)
            res.redirect('/tool');
        else
            res.render(viewPath + "login", {title: 'Login Screen'});
    });

    // Load the login page
    app.get('/login', function(req,res) {
        if(req && req.user)
            res.redirect('/login-redirect');
        res.render(viewPath + "login", {title: 'Login Screen'});
    });

    //Login request, pass off to the correct link, set coookie session info.
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/login-redirect',
        failureRedirect : '/login',
        failureFlash : 'Failed to login.'
    }));

    /* page to redirect to IFS home page or setup, depending on if user has
     * completed set up */
    app.get('/login-redirect', function(req, res) {
        let uid = req.user.id;
        // check if the user completed setup yet
        var q = dbHelpers.buildSelect(dbcfg.user_registration_table) + dbHelpers.buildWhere(['userId']);
        db.query(q, [uid], function(err, data) {
            if (err && data) {
                res.redirect('/');
            }
            if (!data[0].completedSetup){
                if(__EXPERIMENT_ON)
                    res.redirect('/setup');
                else
                    res.redirect("/courses");
            }
            else
                res.redirect('/tool');
            res.end();
        });
    });

    app.get('/register', function ( req,res ) {
        res.render(viewPath + 'register', {title: "Signup Screen", message:"ok"});
    });

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/registration-complete',
        failureRedirect : '/register',
        failureFlash : true,
        badRequestMessage: "Failed to register!"
    }));

    app.get('/registration-complete', function(req, res) {
        if (req && req.user) {
            res.render(viewPath + "/registration-complete", {title: "Success!", message: "Please check your email for a confirmation link. You need to verify your account before you can login.", justSignedUp: true});
            req.session.destroy();
        } else {
            res.render(viewPath + "/registration-complete", {title: "Oops!", message: "Something went wrong and your request could not be processed. If you do not receive a verification link at your email address, contact support.", justSignedUp: true});
        }
        res.end();
    });

    app.get('/logout', function (req, res) {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });

    app.get('/deleteAccount', function(req,res) {
        res.render( viewPath + 'deleteAccount', {title: "Delete Account", message:"Your participation in this research is voluntary and appreciated!!!",
            note:"This removes your IFS account, to be completely removed from the experiement you must contact:",
            researchers:" Dr. Judi McCuaig or James Fraser.",
            leave:"If you would like to delete your account, click below"});
    });

    app.post('/deleteAccount', function(req,res) {
        if(req.user)
        {
            var username = req.user.username;
            if( username )
            {
                var q = dbHelpers.buildSelect(dbcfg.users_table) + dbHelpers.buildWS("username");
                db.query(q, [username], function(err, data) {
                    if (data && data.length > 0) {
                        var updateQ= dbHelpers.buildUpdate(dbcfg.users_table) + " set username = ? " + dbHelpers.buildWS("username");
                        var emailParts = username.split('@');
                        var newUsername =  username.length > 0 ? username[0]+"@zzz" : undefined;
                        if(newUsername) {
                            db.query(updateQ,[newUsername,username], function(err,data2) {
                                if(err)
                                    res.redirect('/tool');
                                else
                                    res.redirect('/logout');
                            });
                        }
                        else
                            res.redirect('/logout');
                    }
                    else {
                        res.redirect('/tool');
                    }
                });
            }
        }
    });
};