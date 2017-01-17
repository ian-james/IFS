/* 
  Modified from Barrett Harber's work on node-express-passport-mysql GitHub.
*/

var router = require('express').Router();
var path = require('path');
var viewPath = path.join( __dirname + "/");
var maxCookieAge = 1000*60*5;

module.exports = function( app, passport ) {

    app.get("/", function(req,res) {
        res.render(viewPath + "login", { title: 'Login  TESTER Screen'});
    })

    // Load the login page
    app.get( "/login", function(req,res){
        res.render( viewPath + "login", { title: 'Login Screen', message:'ok'})
    });

    //Login request, pass off to the correct link, set coookie session info.
    app.post("/login", passport.authenticate('local-login', {
            successRedirect : '/tool',
            failureRedirect : '/login',
            //failureFlash : true
        }),
        function(req,res) {
            console.log("HERE POST");

            if( req.body.remember) {
                req.session.cookie.maxAge = maxCookieAge;
            }
            else {
                req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

    app.get('/register', function ( req,res ) {
        res.render(viewPath + 'register', { title: "Signup SCreen", message:"ok"});
    });

    app.post('/register', passport.authenticate('local-signup', {
            //TODO: Change /tool to a preference selection page.
            successRedirect : '/tool',
            failureRedirect : '/login',
            //failureFlash : true
    }));

    app.get('/profile', isLoggedIn, function( req,res ) {
        res.render(viewPath + "profile", { title: "Profile Screen", message:"ok"});
    });

    app.get('/logout', function (req, res ){
        req.logout();
        req.redirect('/');
    });


}; //Close Export module

// This function ensure the user in or returns them to main navigation point.+
function isLoggedIn( req, res, next ) {
    if( req.isAuthenticated())
        return next();
    res.redirect('/');
}



