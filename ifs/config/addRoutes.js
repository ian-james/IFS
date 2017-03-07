
module.exports = function (app) {

    // Paths and requirements
    var appPath = __appPath;
    var path = require('path');
    var componentsPath = __components
    var passport = require('passport');

    // i18n Translation Routes
    require( path.join( __dirname, "/i18nRoutes"))(app);

    // Dev team Controllers
    require(componentsPath + "/Login/loginRoutes")(app, passport);

    //Tool Page and information
    require(componentsPath + "/Tool/toolRoutes") (app);

    //File Upload routes
    require(componentsPath + "/FileUpload/fileUploadRoutes")(app);

    // Preferences page Routes
    require(componentsPath + "/Preferences/preferencesRoutes")(app);

    // Survey page routes
    require(componentsPath + '/Survey/surveyRoutes')(app);

    //Feedback pages routes
    require(componentsPath + '/Feedback/feedbackRoutes')(app);

    //Word Cloud
    require(componentsPath + '/WordCloud/wordCloudRoutes')(app);

    //Text Summarization
    require(componentsPath + '/TextSummarization/textSummaryRoutes')(app);

    // Test features can be placed here.
    require(componentsPath + "/Test/testRoutes")(app);
}