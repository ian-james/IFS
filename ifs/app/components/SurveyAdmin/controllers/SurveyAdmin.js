const path = require('path');
const _ = require('lodash');

const viewPath = path.join(__components, 'SurveyAdmin/views/');
const Survey = require('./../../Survey/models/Survey');
const Question = require('./../../Survey/models/Question');
const SurveyResponses = require('./../../Survey/models/SurveyResponse');
const chartHelpers = require('./../../Chart/chartHelpers.js');

module.exports = {
  /* Basic page display - all data requests handle by angular */ 
  viewStats: (req, res) => {
    res.render(path.join(viewPath,'surveyStats'), {title: 'Survey Responses'});
  },
  /* Get all metadata for available surveys */
  getSurveysMeta: (req, res) => {
    Survey.getSurveys((err, surveys) => {
      res.json(surveys);
    });
  },
  /* Returns questions for a particular survey */
  getSurveyQuestions: (req, res) => {
    const surveyID = req.params.surveyID;
    Question.getQuestions(surveyID, (err, questions) => {
      res.json(questions);
    });
  },
  /* Returns all responses for a particular question */
  getSurveyResponsesByQuestion: (req, res) => {
    const questionID = req.params.questionID;
    SurveyResponses.getQuestionResponses(questionID, (err, responses) => {
      const responseCount = responses.length;
      /* Reduce the reponses to a count */
      const countObj = _.countBy(responses, 'questionAnswer');
      /* Add 0 count for missing keys */
      for (i = 1; i <= 5; i++) {
        if (countObj[i] == null) {
          countObj[i] = 0;
        }
      }
      Object.keys(countObj).sort();
      let dataArray = _.values(countObj);
      /* Convert to percentage */
      dataArray = _.map(dataArray, val => ((val / responseCount) * 100));
      console.log (dataArray);
      res.json(dataArray);
    });
  },
};
