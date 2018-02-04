/*
 * Includes paths to required resources in node modules or static folders
 */
var express = require('express');
var path = require('path');

module.exports = function (app) {
    /*
     * Core app resources
     */
    // Set directory locations for angular and bootstrap
    var nodeModulesPath = path.join(__dirname + "/../node_modules/");

    // Static Files
    app.use(express.static(path.join( __dirname, "/../app/")));

    // IFS version
    app.use("/version.js", express.static(path.join(__dirname, "/../config/version.js")));

    // Survey JS information
    app.use("/surveyjs",express.static(nodeModulesPath + "/survey-jquery/"));

    // File upload angular (might not be necessary anymore)
    //app.use("/fileUpload", express.static( nodeModulesPath +"angular-file-upload/dist"));

    // jQuery
    app.use("/jquery", express.static(nodeModulesPath + "jquery/dist"));

    // client-side form validation
    app.use("/validate", express.static(nodeModulesPath + "jquery-validation/dist"));

    // Angular
    app.use("/angular", express.static(nodeModulesPath + "angular/"));
    app.use("/angular-sanitize", express.static(nodeModulesPath + "angular-sanitize/"));

    /*
     * UI resources
     */
    // Bootstrap-Angular
    app.use("/bootstrap", express.static(nodeModulesPath + "angular-ui-bootstrap/dist/") );

    // UI-kit
    app.use("/uikit", express.static(nodeModulesPath + "uikit/dist/"));

    // Code Prettification
    app.use("/prettyify", express.static(nodeModulesPath + "/code-prettify/src"));
    app.use("/prettyifyTheme", express.static(nodeModulesPath + "/code-prettify/styles"));

    /*
     * Resource paths for core tools
     */
    // wordcloud
    app.use("/wordcloud", express.static(nodeModulesPath + "/wordcloud/src/"));

    //Socket IO
    app.use("/socketIO", express.static(nodeModulesPath + "/socket.io-client/dist/"));

    // Chart JS
    app.use("/chartjs", express.static(nodeModulesPath + "/chart.js/dist/"));

    // Angular-Chart
    app.use( "/achartjs", express.static(nodeModulesPath + "/angular-chart.js/dist/"));
}
