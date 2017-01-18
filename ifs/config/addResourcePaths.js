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
    // Boostrap-Angular
    app.use( "/bootstrap", express.static(  nodeModulesPath + "angular-ui-bootstrap/dist/") );

    // Static Files
    app.use( express.static( path.join( __dirname + "/../app/") ) );
}