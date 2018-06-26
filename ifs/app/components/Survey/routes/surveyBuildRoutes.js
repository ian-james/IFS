const path = require('path');
const componentPath = path.join(__components,"Survey");
const surveyBuildController = require(path.join(componentPath, 'controllers/surveyBuildController'));

module.exports = function (app) {

    app.get('/createSurveys', surveyBuildController.createSurveys);

    app.get( '/generateMatrixSurvey:n', surveyBuildController.generateMatrixSurvey);

    app.get( '/buildDefaultSurvey:n', surveyBuildController.buildDefaultSurvey);

    app.get('/surveySec/:surveyName/:low/:high/:questionsPerPage?/:splitQuestionTypes?', surveyBuildController.getSurveyWithOptions);

    app.get('/ips', surveyBuildController.setPreferences);
}