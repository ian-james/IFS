const path = require('path');
const _ = require('lodash');
const moment = require('moment');

const viewPath = path.join(__components, 'SurveyAdmin/views/');
const surveyResponse = require(path.join(__components, 'Survey/models/surveyResponse'));
const {
  Survey
} = require(path.join(__modelPath, 'survey'));
const {
  Question
} = require(path.join(__modelPath, 'question'));
const {
  SurveyResult
} = require(path.join(__modelPath, 'surveyResult'));
const {
  SurveyPreference
} = require(path.join(__modelPath, 'surveyPreference'));
const {
  ClassSurvey
} = require(path.join(__modelPath, 'classSurvey'));
const {
  Course
} = require(path.join(__modelPath, 'course'));
const ChartHelpers = require('./../../Chart/chartHelpers.js');
const {
  getResponseCount
} = require(path.join(__modelPath, 'question'));


module.exports = {
  /* Update class survey preferences */
  updateClassSurveyPreferences: async (req, res) => {
    const data = req.body;
    const classId = data.classId;
    for (let pref of data.prefs) {
      if (pref.viewable) {
        const association = await ClassSurvey.query()
          .where('classId', classId)
          .andWhere('surveyId', pref.surveyId);
        if (!association || association.length == 0) {
          await ClassSurvey.query()
            .insert({
              classId: classId,
              surveyId: pref.surveyId
            });
        }
      } else {
        await ClassSurvey.query()
          .delete()
          .where('classId', classId)
          .andWhere('surveyId', pref.surveyId);
      }
    }
    res.send({});
  },
  /* Gets current class survey preferences for a specific course */
  classSurveyPreferences: async (req, res) => {
    const classId = req.params.classId;

    const allSurveys = await Survey.query()
      .select(['id', 'title', 'surveyField']);
    const availSurveys = await ClassSurvey.query()
      .select(['surveyId'])
      .where('classId', classId);
    /* Build new data array with t/f preferences */
    const surveyPreferences = [];
    for (let survey of allSurveys) {
      let obj = {};
      let exists = _.find(availSurveys, (s) => {
        return s.surveyId == survey.id;
      });
      obj = {
        id: survey.id,
        title: survey.title,
        field: survey.surveyField,
        viewable: (exists) ? true : false
      };
      surveyPreferences.push(obj);
    };
    res.json(surveyPreferences);
  },
  /* Get list of classes for class preferences */
  availClasses: async (req, res) => {
    const courses = await Course.query();
    res.json(courses);
  },
  /* Build a new class/survey relationship */
  classSurveys: async (req, res) => {
    res.render(path.join(viewPath, 'classSurvey.pug'), {
      title: 'Class Surveys',
    });
  },
  /* Basic route for survey management */
  manageSurveys: async (req, res) => {
    const surveys = await Survey.query()
    res.render(path.join(viewPath, 'surveyList'), {
      title: 'Manage Surveys',
      surveys: surveys
    })
  },
  /* Given a param ID, delete a specific survey and all associated questions and responses */
  deleteSpecificSurvey: async (req, res) => {
    const surveyId = req.params.surveyId;
    console.log(surveyId);

    if (!surveyId) {
      res.status(500).send({});
    }

    /* Associated Preferences */

    /* All responses */
    await SurveyResult.query()
      .delete()
      .where('surveyId', surveyId);
    /* Then Questions */
    await Question.query()
      .delete()
      .where('surveyId', surveyId);
    /* Survey itself */
    await Survey.query()
      .delete()
      .where('id', surveyId);

    const surveys = await Survey.query()
    res.render(path.join(viewPath, 'surveyList'), {
      title: 'Manage Surveys',
      surveys: surveys
    })

  },
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
  getSurveysMeta: async (req, res) => {
    try {
      const surveys = await Survey.query()
      res.json(surveys);
    } catch (err) {
      console.log(err);
      res.send([]);
    }
  },
  /* Returns questions for a particular survey */
  getSurveyQuestions: async (req, res) => {
    const surveyId = req.params.surveyID;
    const questions = await Question.query()
      .where('surveyId', surveyId);
    res.json(questions);
  },
  /* Filters responses based on settings sent by ser */
  getFilteredResponses: async (req, res) => {
    const questionId = req.params.questionID;
    const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
    const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
    const responseType = req.body.responseType;
    const toolPref = req.body.toolPref;

    if (ChartHelpers.validateDate(startDate) && ChartHelpers.validateDate(endDate) && moment(endDate).isAfter(startDate)) {
      let responses = await SurveyResult.query()
        .select(['survey_result.*', 'preferences.toolValue as toolPref'])
        .where('survey_result.questionId', questionId)
        .andWhere('preferences.toolName', 'pref-toolSelect')
        .andWhere('answeredOn', '>=', startDate)
        .andWhere('answeredOn', '<=', endDate)
        .leftJoin('preferences', 'survey_result.userId', 'preferences.userId' )
        .distinct('survey_result.id');

      /* Filter by survey response type */
      if (responseType != 'both') {
        const filterValue = (responseType == 'pulse') ? 1 : 0;
        responses = _.filter(responses,
          response => (response.pulseResponse == filterValue));
      }

      /* Filter by tool preference */
      if (toolPref != 'both') {
        responses = _.filter(responses, response => (response.toolPref == toolPref));
      }

      /* Transform results into percentages for the chart */
      const responseCount = responses.length;
      const countObj = _.countBy(responses, 'questionAnswer');
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

    } else {
      res.json([]);
    }
  },
};