module.exports = function (app, iosocket) {
    // Paths and requirements
    var appPath = __appPath;
    var path = require('path');
    var componentsPath = __components
    var passport = require('passport');

    // i18n Translation routes
    //require( path.join( __dirname, "/i18nRoutes"))(app);
    require( componentsPath + "/InteractionEvents/eventRoutes")(app, iosocket);

    require(componentsPath + "/Admin/adminRoutes")(app);
    require(componentsPath + "/Admin/adminRemoveRoutes")(app);

    // Login/registration routes
    require(componentsPath + "/Login/loginRoutes")(app, passport);
    require(componentsPath + "/Verify/verifyRoutes")(app, passport);

    // Tool routes
    require(componentsPath + "/Tool/toolRoutes")(app, iosocket);

    // About page routes
    require(componentsPath + "/About/aboutRoutes")(app);

    // File Upload routes
    require(componentsPath + "/FileUpload/fileUploadRoutes")(app, iosocket);

    // Preferences page routes
    require(componentsPath + "/Preferences/preferencesRoutes")(app, iosocket);

    // Survey page routes
    require(componentsPath + '/Survey/surveyRoutes')(app,iosocket);

    // Testing Routes, leave commented out in commits
    require(componentsPath + '/Survey/surveyBuildRoutes')(app);

    // Feedback pages routes
    require(componentsPath + '/Feedback/feedbackRoutes')(app, iosocket);

    // Word Cloud
    require(componentsPath + '/WordCloud/wordCloudRoutes')(app);

    // Text Summarization
    require(componentsPath + '/TextSummarization/textSummaryRoutes')(app);

    // DashBoard
    require(componentsPath + '/Dashboard/dashboardRoutes')(app, iosocket);

    // Courses routes
    require(componentsPath + '/Courses/coursesRoutes')(app, iosocket);
    // Student Profile page routes
    require(componentsPath + "/StudentProfile/profileRoutes")(app, iosocket);

    // Student Skill routes
    require(componentsPath + "/StudentSkill/studentSkillRoutes")(app, iosocket);

    // Event Tracking
    require(componentsPath + '/InteractionEvents/trackedEventRoutes')(app, iosocket);

    // Post Registration Setup
    require(componentsPath + '/Setup/setupRoutes')(app, iosocket);

    // Open Learner and Social Learner Models
    require(componentsPath + "/StudentModel/studentModelRoutes")(app,iosocket);
    require(componentsPath + "/SocialModel/socialModelRoutes")(app,iosocket);

    // Test features can be placed here.
    require(componentsPath + "/Test/testRoutes")(app);
}
