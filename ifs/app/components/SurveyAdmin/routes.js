const path = require('path');
const SurveyAdminController = require('./controllers/SurveyAdmin');
const SurveyBuilding = require('./controllers/SurveyBuilding');

module.exports = (app, iosocket) => {
  app.get('/surveys/stats', SurveyAdminController.viewStats);
  app.get('/surveys/meta/', SurveyAdminController.getSurveysMeta);
  app.get('/surveys/questions/:surveyID', SurveyAdminController.getSurveyQuestions);
  app.post('/surveys/responses/:questionID', SurveyAdminController.getFilteredResponses);
  app.get('/surveys/admin/get', SurveyAdminController.downloadSurvey);
  app.get('/surveys/create', SurveyBuilding.createSurveyForm);
  app.post('/surveys/create', SurveyBuilding.createSurveyAndQuestions);
};
