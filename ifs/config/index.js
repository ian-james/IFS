// Create the express app
var express = require('express');
var app = express();

// Set our paths for finding our code.
var path = require('path');
var appPath = path.join( __dirname + "/../app/");
var componentsPath = path.join( appPath + "/components");

var port = 3000;

// Set App variables.
app.set( 'port', port );
app.set( 'view engine', 'pug');

// Set directory locations for angular and bootstrap
var nodeModulesPath =  path.join( __dirname + "/../node_modules/");
app.use( "/angular", express.static( nodeModulesPath + "angular/") );
app.use( "/bootstrap", express.static(  nodeModulesPath + "angular-ui-bootstrap/dist/") );
app.use( express.static( appPath )  );


// Middleware Sections ( Standard inclusion with Node/Express server)
// A logging middleware 
var logger = require('morgan');
app.use( logger('dev'));

// Parses incoming requests  ( not multipart)
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true}) );

// Middleware for uploading multipart files and form data
// Include this once we need to upload the files.
// var multer = require('multer');
// app.use( multer() );

// Middleware to over routes
var methodOverride = require("method-override");
app.use( methodOverride() );


// Dev team Controllers
var loginRoutes = require(componentsPath + "/Login/" + "loginRoutes");
app.use( '/', loginRoutes );

var toolRoutes = require(componentsPath + "/Tool/" + "toolRoutes");
app.use( '/Tool', toolRoutes);

// Error handling in common format (err,req,res,next)
var errorHandler = require('errorhandler');
if( app.get('env') === 'development' ){
    console.log("Using development errorHandler");
    app.use( errorHandler() );
}

// Start the app listening
app.listen( app.get('port') , function() {
    console.log( "Listening on port " + app.get('port'));
});