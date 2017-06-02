
module.exports = function (app, iosocket) {

    // Paths and requirements
    var appPath = __appPath;
    var path = require('path');
    var componentsPath = __components
    var passport = require('passport');

    // i18n Translation routes
    require( path.join( __dirname, "/i18nRoutes"))(app);

    require( componentsPath + "/InteractionEvents/eventRoutes")(app,iosocket);

    // Dev Team Controllers
    require(componentsPath + "/Login/loginRoutes")(app, passport);

    // Tool routes
    require(componentsPath + "/Tool/toolRoutes")(app, iosocket);

    // About page routes
    require(componentsPath + "/About/aboutRoutes")(app);

    //File Upload routes
    require(componentsPath + "/FileUpload/fileUploadRoutes")(app,iosocket);

    // Preferences page routes
    require(componentsPath + "/Preferences/preferencesRoutes")(app, iosocket);

    // Survey page routes
    require(componentsPath + '/Survey/surveyRoutes')(app,iosocket);

    // Testing Routes, leave commented out in commits
    require(componentsPath + '/Survey/surveyBuildRoutes')(app);

    //Feedback pages routes
    require(componentsPath + '/Feedback/feedbackRoutes')(app,iosocket);

    //Word Cloud
    require(componentsPath + '/WordCloud/wordCloudRoutes')(app);

    //Text Summarization
    require(componentsPath + '/TextSummarization/textSummaryRoutes')(app);

    require(componentsPath + '/Dashboard/dashboardRoutes')(app,iosocket);

    // Test features can be placed here.
    require(componentsPath + "/Test/testRoutes")(app);
}
