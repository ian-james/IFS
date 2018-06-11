/* Packages */
const moment = require('moment');
const path = require('path');
var _ = require('lodash');
/* Local modules */
const componentPath = path.join(__components,"Survey");
const viewPath = path.join( __components, 'Survey/views/');
const SurveyManager = require(path.join(componentPath, "helpers/surveyManager"));
var SurveyBuilder = require(path.join(componentPath, "helpers/surveyBuilder"));
/* Models */
var Survey = require( __components + "/Survey/models/Survey");

module.exports = {
  /* Returns a list of surveys */
  surveyList: (req, res) => {
    SurveyManager.getUserSurveyProfileAndSurveyType(req.user.id, function(err, surveyData) {
      var keys = ['surveyId','lastRevision', 'currentSurveyIndex', 'surveyName','title', 'surveyField'];
      var ans = _.map(surveyData, obj=> _.pick(obj,keys));

      ans = _.map(ans, function( obj ) {
          var rev = obj['lastRevision'];
          if( rev )
              obj['lastRevision'] = moment(obj['lastRevision']).format("hh:mm a DD-MM-YYYY");
          return obj;
      });

      res.render(viewPath + 'surveyList', { 'title': "Survey List", "surveys": ans});
    });
  },
  /**
   * Method gets the full survey and displays it.
   * @param  {[type]} req  [description]
   * @param  {[type]} res) {                   var surveyName [description]
   * @return {[type]}      [description]
   */
  getSpecificSurvey: (req, res) => {
    const surveyName = req.params.surveyName;
    Survey.getSurvey(surveyName, (err,surveyData) => {
        if( err ) {
            Logger.error(err);
        }
        else if(surveyData.length >= 1 && surveyData[0].surveyName == surveyName)
        {
            SurveyBuilder.loadSurveyFile( surveyData[0], function(err,data){
                const sqs = JSON.stringify(data);
                res.render(viewPath + "questionsLayout", { "title": 'Survey', "surveyQuestions": sqs} );
            });
        }
        else {
            // Could throw an error here indicating failure to reach survey
            res.end();
        }
    });
  },
};
