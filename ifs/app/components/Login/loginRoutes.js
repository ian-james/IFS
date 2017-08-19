/*
  Modified from Barrett Harber's work on node-express-passport-mysql GitHub.
*/

var router = require('express').Router();
var path = require('path');
var viewPath = path.join( __dirname + "/");
var Logger = require( __configs + "loggingConfig");

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

    // Call Authenticate before every function
    app.use( isAuthenticated );

    // Function to provide login Information to Angular
    app.get("/user/data", function(req,res) {
        if( req && req.user  )
            return res.status(200).json( {user: req.user.username} );
        return res.status(400);
    });

    app.get("/", function(req,res) {
        if(req && req.user)
            res.redirect('/tool');
        else
            res.render(viewPath + "login", { title: 'Login Screen'});
    });

    // Load the login page
    app.get( "/login", function(req,res) {
        if(req && req.user)
            res.redirect('/tool');
        res.render( viewPath + "login", { title: 'Login Screen'});
    });

    //Login request, pass off to the correct link, set coookie session info.
    app.post("/login", passport.authenticate('local-login', {
        successRedirect : '/tool',
        failureRedirect : '/login'
    }));

    app.get('/register', function ( req,res ) {
        res.render(viewPath + 'register', { title: "Signup Screen", message:"ok"});
    });

    /* 
     */
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/logout',
        failureRedirect : '/register',
        failureFlash : true,
        badRequestMessage: "Failed to register!"
    }));

    app.get('/logout', function (req, res ){
        req.session.destroy(function(err){
            res.redirect('/');
        });
    });
}; 




