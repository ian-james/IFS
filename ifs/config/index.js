// Create the express app
var express = require('express');
var app = express();

// Set our paths for finding our code.
var path = require('path');
//var appPath = path.join( __dirname + "/../app/");
//var componentsPath = path.join( appPath + "/components");
//
global.__base =  path.join(__dirname, "../");
global.__configs = path.join(__dirname, "/");
    ;
global.__tools = path.join( __dirname , "../tools/");
global.__components = path.join( __dirname, "../app/components/");
global.__appPath = path.join( __dirname, "../app/");

var port = process.env.PORT || 3000;
// Set App variables.
app.set( 'port', port );

// Add path information
require( "./addResourcePaths.js")(app);

// Add middleware 
require( "./addMiddleware.js") (app);

// Add Developer Routes
require("./addRoutes.js")(app);

// Error handling in common format (err,req,res,next)
var errorHandler = require('errorhandler');
if( app.get('env') === 'development' ){
    app.use( errorHandler() );
}

// Start the app listening
app.listen( app.get('port') , function() {
    console.log( "Listening on port " + app.get('port'));
});
