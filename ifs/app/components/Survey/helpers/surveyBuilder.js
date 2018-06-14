var _ = require('lodash');
var fs = require('fs');
var async = require('async');
const path = require('path');

var db = require(__configs + 'database');
var dbcfg = require(__configs + 'databaseConfig');
var Errors = require(__components + "Errors/errors");
var Logger = require(__configs + "loggingConfig");

var SurveyPreferences = require(__components + "Survey/models/SurveyPreferences");
var Constants = require(__components + "Constants/programConstants");
var Survey = require(__components + "Survey/models/Survey");
var Question = require(__components + "Survey/models/Question");
const Serializers = require(path.join(__components, 'Survey/helpers/Serializer'));
const SurveyManager = require(path.join(__components, 'Survey/helpers/surveyManager'));

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

/* Builds a survey json out of 2 random questions from an allowed survey that's randomly 
 * selected.  
 * 
 */
let buildPulseSurvey =  (toolType, userId, callback) => {
  SurveyManager.getUserSurveyProfileAndSurveyType(userId, (err, surveyPref) => {
    if (err) {
      callback([]);
    }
    /* Get list of allowed surveys based on user preferences */
    let surveyOpt = getSurveyFieldMatches(surveyPref,"surveyField",[toolType, "general"]);
    surveyOpt = getSurveyFieldMatches(surveyOpt,"surveyFreq",["reg"]);
    let allowedSurveys = getAllowedSurveys(surveyOpt);
    
    /* Select a random survey out of those selected */
    if (!allowedSurveys) {
      callback ([]);
    } 

    /* Pick a random survey out of those selected */
    const selectedSurvey = _.sample(allowedSurveys);
    const surveyId = selectedSurvey.id;
    /* Get questions from the selected survey, return in callback - 2 limit hardcoded */
    Question.selectRandomQuestions(surveyId, 2, (err, questions) => {
      let surveyData = Serializers.serializeSurvey([selectedSurvey], questions, Serializers.matrixSerializer);
      callback(surveyData);
    });
  });
}
















function setDefaultDisplaySurveyOptions(questionsPerPage = 4, splitQuestionTypes = true, range = [0, 100]) {
  var opts = Constants.surveyDisplayDefaultOptions();

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
function isMatrix(obj) {
  return obj && obj.hasOwnProperty('type') && obj.type == "matrix";
}

/**
 * Loads a surveyJS file and either logs error or parse data and sends to callback.
 * @param  {[type]}   surveyData [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
function loadSurveyFile(surveyData, callback) {
  fs.readFile(surveyData.fullSurveyFile, 'utf-8', function (err, data) {
    if (err) {
      Logger.error(err);
    } else {
      data = JSON.parse(data);
      callback(null, data);
    }
  });
}

/**
 * Separate a Matrix type question into multiple sections
 * Takes each row value and combines it with the remainder of the questions's json
 * Essentially, splitting the rows but keeping all the data.
 * @param  {[type]} matrixQuestion [description]
 * @return {[type]}                [description]
 */
function separateMatrixType(matrixQuestion) {
  var questions = matrixQuestion.rows;
  if (questions && questions.length >= 1) {
    var separatedQs = [];
    for (var i = 0; i < questions.length; i++) {
      var template = _.clone(matrixQuestion);
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
function mergeMatrixType(questions) {
  if (questions && questions.length >= 1 && isMatrix(questions[0])) {
    var sectionName = questions[0].name;
    var template = questions[0];
    for (var i = 1; i < questions.length; i++) {
      if (isMatrix(questions[i]) && questions[i].name == sectionName) {
        template.rows = template.rows.concat(questions[i].rows);
      }
    }
    return template;
  }
  return questions;
}

/**
 * Gets all the questions out of the Survey format
 * @param  {[type]} survey [description]
 * @return {[type]}        [description]
 */
function pullSurveyQuestions(survey) {
  var questions = []
  if (survey && survey.pages) {
    for (var i = 0; i < survey.pages.length; i++) {
      for (var y = 0; y < survey.pages[i].questions.length; y++) {
        if (isMatrix(survey.pages[i].questions[y]))
          questions = questions.concat(separateMatrixType(survey.pages[i].questions[y]));
        else
          questions.push(survey.pages[i].questions[y]);
      }
    }
  }
  return questions;
}

/**
 * Extract all the questions finds the questions in a specific range and
 * modifies the presentation of the survey to a specific format.
 * *This is only tested on Matrix and a couple simple question Types.
 * @param  {[type]} survey  [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function buildSurveySection(survey, options) {
  var surveyOut = buildDefaultSurveyData(survey);
  if (survey && survey.pages) {
    // Get Questions from Survey Format
    var questions = pullSurveyQuestions(survey);

    // Setup short form survey Properties.
    // Questions per page, organize by question Type.
    var range = options['range'] || [0, questions.length];
    var questionsPerPage = options['questionsPerPage'] || questions.length;
    var splitQuestionTypes = options['splitQuestionTypes'] || true;

    var pages = [];
    var page = []
    var buildingType = undefined;
    var questionsInRange = questions.slice(range[0], range[1]);

    // Internal function to handle separting pages.
    var resetPageInfo = function () {
      if (page.length > 0) {
        if (isMatrix(page[0])) {
          page = mergeMatrixType(page);
          pages.push({
            "questions": [page]
          });
        } else {
          pages.push({
            "questions": page
          });
        }
      }
      buildType = undefined;
      page = [];
    }

    // Go through all the question and put them into pages.
    for (var i = 0; i < questionsInRange.length; i++) {

      if (!buildingType)
        buildingType = questionsInRange[i].type;

      // Add question to the page because either question type matches
      // or we don't can't about matching question types.
      if (!splitQuestionTypes || (splitQuestionTypes && buildingType == questionsInRange[i].type)) {
        page.push(questionsInRange[i]);
        if (page.length >= questionsPerPage || i + 1 == questionsInRange.length) {
          resetPageInfo();
        }
      } else {
        resetPageInfo();
        buildingType = questionsInRange[i].type;
        page.push(questionsInRange[i]);
      }
    }
    surveyOut.pages = pages;
  }
  return surveyOut;
}

/**
 * Loads a surveySection and builds sections then calls callback.
 * This is the public interface of the surveySection.
 * @param  {[type]}   surveyData [description]
 * @param  {[type]}   options    [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
function getSurveySection(surveyData, options, callback) {

  loadSurveyFile(surveyData, function (err, survey) {
    var jsonSurvey = buildSurveySection(survey, options);
    callback(null, jsonSurvey);
  });
}

/**
 * Setup Survey Preferences to Default values when user signs up.
 * Callback is pretty much loggin, nothing is required on fail.
 * @param {[type]}   userId   [description]
 * @param {Function} callback [description]
 */
function setSignupSurveyPreferences(userId, callback) {
  Survey.getSurveys(function (err, surveyData) {
    if (!err) {
      var surveyPrefsData = [];
      for (var i = 0; i < surveyData.length; i++) {
        surveyPrefsData.push([userId, surveyData[i].id, null, surveyData[i].totalQuestions]);
      }

      async.map(surveyPrefsData,
        SurveyPreferences.insertSurveyPrefs,
        function (err, data) {
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

module.exports.getSurveySection = getSurveySection;
module.exports.setDisplaySurveyOptions = setDefaultDisplaySurveyOptions;
module.exports.setSignupSurveyPreferences = setSignupSurveyPreferences;
//module.exports.loadSurveyQuestions = loadSurveyQuestions;