// Middleware Sections ( Standard inclusion with Node/Express server)

module.exports = function (app) {

// Add middleware for view Engine (Jade/Pug)
app.set( 'view engine', 'pug');

// A logging middleware 
var logger = require('morgan');
app.use( logger('dev'));

// Parses incoming requests  ( not multipart)
/*
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false}) );
*/

// Middleware to over routes
var methodOverride = require("method-override");
app.use( methodOverride() );

// Passport included
var passport = require('passport');

// Express-sessional information
var session = require('express-session');
app.use( session({
    secret: 'ifsSecretSessionInfo',
    resave: true,
    saveUninitialized: true
    })
);

//Require passport routes
require( "./passport") (passport);

app.use( passport.initialize() );
app.use( passport.session());

}