const componentPath = path.join(__components,"Survey");
const surveyBuildController = require(path.join(componentPath, 'controllers/surveyBuildController'));

module.exports = function (app) {

    app.get('/createSurveys', surveyBuildController.createSurveys);

    app.get( '/generateMatrixSurvey:n', surveyBuildController.generateMatrixSurvey);

    app.get( '/buildDefaultSurvey:n', surveyBuildController.buildDefaultSurvey);

    app.get('/surveySec/:surveyName/:low/:high/:questionsPerPage?/:splitQuestionTypes?', surveyBuildController.getSurveyWithOptions);

    /*//Helpful little route to create survey prefernces, not sure this will live on.
    app.get('/ips', function(req,res) {
        var userId = req.user.id || req.passport.user;
        SurveyBuilder.setSignupSurveyPreferences( userId, function(err,data) {
            res.end();
        });
    });*/
}