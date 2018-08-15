const path = require('path');
const SurveyAdminController = require('./controllers/SurveyAdmin');
const SurveyBuilding = require('./controllers/SurveyBuilding');
const multer = require('multer');
const questionsFile = multer();

module.exports = (app, iosocket) => {
  app.get('/admin/surveys/stats', SurveyAdminController.viewStats);
  app.get('/admin/surveys/meta/', SurveyAdminController.getSurveysMeta);
  app.get('/admin/surveys/questions/:surveyID', SurveyAdminController.getSurveyQuestions);
  app.post('/admin/surveys/responses/:questionID', SurveyAdminController.getFilteredResponses);
  app.get('/admin/surveys/get', SurveyAdminController.downloadSurvey);
  app.get('/admin/surveys/create', SurveyBuilding.createSurveyForm);
  app.post('/admin/surveys/create', questionsFile.single('fullSurveyFile'), SurveyBuilding.createSurveyAndQuestions);
  app.get('/admin/surveys', SurveyAdminController.manageSurveys)
  app.delete('/admin/surveys/delete/:surveyId', SurveyAdminController.deleteSpecificSurvey);
  app.get('/admin/surveys/classes', SurveyAdminController.classSurveys);
  app.get('/admin/surveys/classes/:classId', SurveyAdminController.classSurveyPreferences);
  app.get('/admin/surveys/classlist', SurveyAdminController.availClasses);
  app.post('/admin/surveys/classes', SurveyAdminController.updateClassSurveyPreferences);
};
