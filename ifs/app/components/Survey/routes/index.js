const path = require('path');
const componentPath = path.join(__components,"Survey");
const surveyController = require(path.join(componentPath, '/controllers/surveyController'));

module.exports = (app, iosocket) => {
 // Admin related routes - keeping this for legacy purposes atm, might remove later
 require('./surveyBuildRoutes.js')(app);
 
 // General survey routes
 app.get('/surveys', surveyController.surveyList);

 app.post( '/survey/sentData', surveyController.sendSurveyData);

 app.get ('/survey/:surveyID', surveyController.getMatrixFromDB);

 //app.get ('/pulsetest', surveyController.getPulseSurvey);
 
};
