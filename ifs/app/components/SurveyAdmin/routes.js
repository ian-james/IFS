const path = require('path');
const SurveyAdminController = require('./controllers/SurveyAdmin');

module.exports = (app, iosocket) => {
  app.get('/surveys/stats', SurveyAdminController.viewStats);
  app.get('/surveys/meta/', SurveyAdminController.getSurveysMeta);
  app.get('/surveys/questions/:surveyID', SurveyAdminController.getSurveyQuestions);
  app.post('/surveys/responses/:questionID', SurveyAdminController.getFilteredResponses);
};
