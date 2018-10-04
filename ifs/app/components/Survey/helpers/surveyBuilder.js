const _ = require('lodash');
const fs = require('fs');
const async = require('async');
const path = require('path');

const db = require(__configs + 'database');
const dbcfg = require(__configs + 'databaseConfig');
const Errors = require(__components + "Errors/errors");
const Logger = require(__configs + "loggingConfig");

const SurveyPreferences = require(__components + "Survey/models/surveyPreferences");
const Constants = require(__components + "Constants/programConstants");
const Survey = require(__components + "Survey/models/survey");
const Question = require(__components + "Survey/models/question");
const Serializers = require(path.join(__components, 'Survey/helpers/Serializer'));
const SurveyManager = require(path.join(__components, 'Survey/helpers/surveyManager'));
const { optedIn } = require(path.join(__modelPath, 'preferences'));
const { getStudentIdForUser } = require(path.join(__modelPath, 'student'));
const { getPulseSurveyState } = require(path.join(__modelPath, 'survey'));
const { resetPulseProgress } = require(path.join(__modelPath, 'surveyPreference'));
const { getPulseQuestions } = require(path.join(__modelPath, 'question'));

/**
 * Default parameters for our surveys, add more as necessary.
 * @param  {[type]} surveyData [description]
 * @return {[type]}            [description]
 */
let buildMatrixSurvey = (surveyData) => {
  return {
    "questions": [{
      "type": "matrix",
      "name": surveyData[0].surveyName || "NAME-ME",
      "title": surveyData[0].title || "Title-Me",
      "columns": [{
          "value": 1,
          "text": "Strongly Disagree"
        },
        {
          "value": 2,
          "text": "Disagree"
        },
        {
          "value": 3,
          "text": "Neutral"
        },
        {
          "value": 4,
          "text": "Agree"
        },
        {
          "value": 5,
          "text": "Strongly Agree"
        }
      ],
      "rows": []
    }]
  };
};

/**
 * Default parameters for our surveys, add more as necessary.
 * @param  {[type]} surveyData [description]
 * @return {[type]}            [description]
 */
let buildDefaultSurveyData = (surveyData) => {
  return {
    "title": surveyData[0].title,
    "showProgressBar": "bottom",
    "goNextPageAutomatic": false,
    "showNavigationButtons": true,
    "pages": []
  };
}

/*
 * Filters surveys by those that are allowed to be asked
 *
 */
let getAllowedSurveys = (surveyPrefData) => {
  return _.filter(surveyPrefData, (s) => {
      return s.allowedToAsk;
  });
};

/*
 * Filters preferences to specific related tools
 *
 */
let getSurveyFieldMatches = (surveyPrefData, field, matchingFields) => {
  return _.filter(surveyPrefData, (s) => {
      if( !_.has(s,field) )
          return false;
      return matchingFields.includes(s[field]);
  });
};

let buildPulseSurvey = async (toolType, userId, callback) => {

  if (!__EXPERIMENT_ON) {
    callback(JSON.stringify([]));
    return;
  }

  const studentId = await getStudentIdForUser(userId);

  if (await optedIn(studentId)) {
    let surveys = await getPulseSurveyState(studentId, toolType);
    /* If no incomplete surveys, reset progress and try again */
    if (!surveys || surveys.length == 0) {
      await resetPulseProgress(userId);
      surveys = await getPulseSurveyState(studentId, toolType);
    }

    if (!surveys || surveys.length == 0) {
      callback(JSON.stringify([]));
    } else {
      const curSurveyId = surveys[0].id;
      const curQuestion = surveys[0].currentIndex;
      const questions = await getPulseQuestions(curSurveyId, curQuestion, 2);

      const surveyData = Serializers.serializeSurvey([surveys[0]], questions, Serializers.matrixSerializer);

      callback(JSON.stringify(surveyData));
    }
  } else {
    callback(JSON.stringify([]));
  }
}


let setDefaultDisplaySurveyOptions = (questionsPerPage = 4, splitQuestionTypes = true, range = [0, 100]) => {
  let opts = Constants.surveyDisplayDefaultOptions();

  range[0] = range[0] || opts.range[0];
  range[1] = range[1] || opts.range[1];

  opts['range'] = range || opts.range;
  opts['questionsPerPage'] = questionsPerPage || opts['questionsPerPage'];
  opts['splitQuestionTypes'] = splitQuestionTypes || opts['splitQuestionTypes'];

  return opts;
}


/**
 * CHeck if object has type matrix
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
let isMatrix = (obj) => {
  return obj && obj.hasOwnProperty('type') && obj.type == "matrix";
}


/**
 * Separate a Matrix type question into multiple sections
 * Takes each row value and combines it with the remainder of the questions's json
 * Essentially, splitting the rows but keeping all the data.
 * @param  {[type]} matrixQuestion [description]
 * @return {[type]}                [description]
 */
let separateMatrixType = (matrixQuestion) => {
  const questions = matrixQuestion.rows;
  if (questions && questions.length >= 1) {
    const separatedQs = [];
    for (let i = 0; i < questions.length; i++) {
      const template = _.clone(matrixQuestion);
      template.rows = [questions[i]];
      separatedQs.push(template);
    }
    return separatedQs;
  }
  return matrixQ;
}

/**
 * Merge multiple matrix type questions into a single section.
 * Will only merge matrix types questions with the same name and type.
 * @param  {[type]} questions [description]
 * @return {[type]}           [description]
 */
let mergeMatrixType = (questions) => {
  if (questions && questions.length >= 1 && isMatrix(questions[0])) {
    const sectionName = questions[0].name;
    const template = questions[0];
    for (let i = 1; i < questions.length; i++) {
      if (isMatrix(questions[i]) && questions[i].name == sectionName) {
        template.rows = template.rows.concat(questions[i].rows);
      }
    }
    return template;
  }
  return questions;
}


/**
 * Setup Survey Preferences to Default values when user signs up.
 * Callback is pretty much loggin, nothing is required on fail.
 * @param {[type]}   userId   [description]
 * @param {Function} callback [description]
 */
let setSignupSurveyPreferences = (userId, callback) => {
  Survey.getSurveys(function (err, surveyData) {
    if (!err) {
      const surveyPrefsData = [];
      for (let i = 0; i < surveyData.length; i++) {
        surveyPrefsData.push([userId, surveyData[i].id, null, surveyData[i].totalQuestions]);
      }

      async.map(surveyPrefsData,
        SurveyPreferences.insertSurveyPrefs,
         (err, data) => {
          callback(err, data);
        }
      );
    } else {
      callback(err, null);
    }
  });
}

// Exported functions.
module.exports.buildMatrixSurvey = buildMatrixSurvey;
module.exports.buildDefaultSurveyData = buildDefaultSurveyData;
module.exports.getAllowedSurveys = getAllowedSurveys;
module.exports.getPulseSurvey = buildPulseSurvey;
module.exports.setDisplaySurveyOptions = setDefaultDisplaySurveyOptions;
module.exports.setSignupSurveyPreferences = setSignupSurveyPreferences;
