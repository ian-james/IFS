/*
 Includes paths to required resources in node modules or static folders
*/
var express = require('express');
var path = require('path');


module.exports = function (app) {

    // Set directory locations for angular and bootstrap
    var nodeModulesPath =  path.join( __dirname + "/../node_modules/");
    // File upload angular (might not be necessary anymore)
    app.use( "/fileUpload", express.static( nodeModulesPath +"angular-file-upload/dist"));

    // Angular
    app.use( "/angular", express.static( nodeModulesPath + "angular/") );

      // Angular
    app.use( "/angular-sanitize", express.static( nodeModulesPath + "angular-sanitize/") );

    // Boostrap-Angular
    app.use( "/bootstrap", express.static(  nodeModulesPath + "angular-ui-bootstrap/dist/") );

    // WordCloud library
    app.use("/wordcloud", express.static( nodeModulesPath + "/wordcloud/src/") );

    // Code Prettification
    app.use("/prettyify", express.static(nodeModulesPath + "/code-prettify/src") );
    app.use("/prettyifyTheme", express.static(nodeModulesPath + "/code-prettify/styles") );

    // Survey JS information
    app.use("/surveyjs",express.static(nodeModulesPath + "/survey-jquery/") );

    // Static Files   
    app.use( express.static( path.join( __dirname, "/../app/") ) );
}