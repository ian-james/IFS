const moment = require('moment');
const path = require('path');

const componentPath = path.join(__components,"Survey");
const SurveyManager = (path.join(componentPath, "helpers/surveyManager"));


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
  }
};
