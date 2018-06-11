const path = require('path');
const componentPath = path.join(__components,"Survey");
const surveyController = require(path.join(componentPath, '/controllers/surveyController'));

module.exports = function (app, iosocket ) {

    app.get('/surveys', surveyController.surveyList);

    app.get('/survey:surveyName', surveyController.getSpecificSurvey);

    app.post( '/survey/sentData', surveyController.sendSurveyData);
}