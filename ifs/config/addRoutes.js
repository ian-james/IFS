
module.exports = function (app) {

    // Paths and requirements
    var appPath = __dirname + "/../app/";
    var path = require('path');
    var componentsPath = path.join( appPath + "/components");
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
}