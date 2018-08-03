const path = require('path');
const _ = require('lodash');
const moment = require('moment');

const viewPath = path.join(__components, 'SurveyAdmin/views/');
const Survey = require('./../../Survey/models/Survey');
const Question = require('./../../Survey/models/Question');
const SurveyResponses = require('./../../Survey/models/SurveyResponse');
const ChartHelpers = require('./../../Chart/chartHelpers.js');
const { getResponseCount } = require(path.join(__modelPath, 'question'));


module.exports = {
  /* Gets all data for a selected survey in exportable format */
  downloadSurvey: async (req, res) => {
    const data = await getResponseCount(9);
    res.send(data);
  },
  /* Basic page display - all data requests handle by angular */
  viewStats: (req, res) => {
    res.render(path.join(viewPath, 'surveyStats'), {
      title: 'Survey Responses'
    });
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
  /* Filters responses based on settings sent by ser */
  getFilteredResponses: (req, res) => {
    const questionID = req.params.questionID;
    const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
    const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
    const responseType = req.body.responseType;
    const toolPref = req.body.toolPref;

    if (ChartHelpers.validateDate(startDate) && ChartHelpers.validateDate(endDate) && moment(endDate).isAfter(startDate)) {
      SurveyResponses.getQResponses(questionID, (err, responses) => {

        /* Filter SQL result by date range */
        let filteredResponse = _.filter(responses, (response) => {
          const answeredOn = moment(response.answeredOn).format('YYYY-MM-DD');
          return (moment(answeredOn).isSameOrAfter(startDate) && moment(answeredOn).isSameOrBefore(endDate));
        });

        /* Filter by survey response type */
        if (responseType != 'both') {
          const filterValue = (responseType == 'pulse') ? 1 : 0;
          filteredResponse = _.filter(filteredResponse, 
            response => (response.pulse_response == filterValue));
        }

        /* Filter by tool preference */
        if (toolPref != 'both') {
            filteredResponse = _.filter(filteredResponse, response => (response.toolPref == toolPref));
        }

        /* Transform results into percentages for the chart */
        const responseCount = filteredResponse.length;
        const countObj = _.countBy(filteredResponse, 'questionAnswer');
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

        res.json(dataArray);
      });
    } else {
      res.json([]);
    }
  },
};