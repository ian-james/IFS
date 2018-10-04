const path = require('path');
const fs = require('fs');
const async = require('async');
const _ = require('lodash');

const Logger = require( __configs + "loggingConfig");
const componentPath = path.join(__components, "Survey");
const staticSurvey = require(path.join(componentPath, 'helpers/staticSurvey'));
const SurveyBuilder = require( __components + "Survey/helpers/surveyBuilder");
const Errors = require(__components + "Errors/errors");

const Survey = require(__components + "Survey/models/survey");
const Question = require(__components + "Survey/models/question")

module.exports = {

  /**
   * Create  basic Survey information and store it in database.
   * Creation of Survey Information needs to occur before buildSurvey
   * @param  {[type]} req  [description]
   * @param  {Array}  res) {                   var surveyNames [description]
   * @return {[type]}      [description]
   */
  createSurveys: (req, res) => {
    const allData = staticSurvey.getStaticSurveyData();
    // pop  survey questions files
    async.map(allData,
      Survey.insertSurvey,
      (err) => {
        if (err)
          Logger.error("CREATE SURVEYS Insert failed with error", err);
        res.end();
      }
    );
  },

  /**
   * Generate an all matrix survey for a set of questions, read from **surveyQuestions**.json
   * Puts a single page with all likert/matrix type questions in.
   * Use other functions to format. This function doesn't overwrite for safety.
   * @param  {[type]} req  [description]
   * @param  {[type]} res) {                   var allData [description]
   * @return {[type]}      [description]
   */
  generateMatrixSurvey: (req, res) => {
    var allSurveys = staticSurvey.getStaticSurveyData();
    var i = Math.max(0, Math.min(req.params.n, allSurveys.length - 1));
    // Survey N becomes the default
    var [surveyName, surveyAuthors, surveyTitle, numQuestions, surveyField, freq, surveyFiles, surveyQuestions] = allSurveys[i];

    if (fs.existsSync(surveyFiles)) {
      console.log("SURVEY FILE EXISTS, will not overwrite, please remove the local file.");
      res.end();
      return;
    }
    Survey.getSurvey(surveyName, function (err, data) {
      if (err)
        Logger.error(err);
      else {
        if (data.length >= 1) {
          var survey = data[0];
          console.log(surveyQuestions);
          var surveyFile = surveyQuestions;

          fs.readFile(surveyFile, "utf-8", function (err, fileData) {
            if (err)
              console.log("Can't read file:", surveyFile);
            else {
              var jsonData = JSON.parse(fileData);
              // For each question insert
              if (jsonData['QuestionText']) {

                // Build default Survey and write to file, specified in DB.
                var s = SurveyBuilder.buildDefaultMatrixSurvey(data[0], jsonData['QuestionText']);
                s = JSON.stringify(s);
                fs.writeFileSync(String("./" + data[0].fullSurveyFile), s, 'utf-8');
                res.end();
              }
            }
          });
        }
      }
    });
  },

  /**
   * This function is for testing, it will build  and store in DB whichever survey with default params
   * Default params are English and Matrix Question Type
   * Note Questions are placed in separted json files, so those are loaded here as well.
   *     There is a different function to create Surveys
   * @param  {[type]} req  [description]
   * @param  {Array}  res) {                   var surveyNames [description]
   * @return {[type]}      [description]
   */
  buildDefaultSurvey: (req, res) => {
    var allSurveys = staticSurvey.getStaticSurveyData();
    var i = Math.max(0, Math.min(req.params.n, allSurveys.length - 1));
    var [surveyName, surveyAuthors, surveyTitle, numQs, surveyField, freq, surveyFiles, surveyQuestions] = allSurveys[i];

    Survey.getSurvey(surveyName, function (err, data) {
      if (err)
        Logger.error(err);
      else {
        if (data.length >= 1) {
          var survey = data[0];
          var surveyFile = surveyQuestions;

          fs.readFile(surveyFile, "utf-8", function (err, fileData) {
            if (err)
              console.log("Can't read file:", surveyFile);
            else {
              var jsonData = JSON.parse(fileData);
              // For each question insert
              if (jsonData['QuestionText']) {
                var dde = [];
                for (var j = 0; j < jsonData['QuestionText'].length; j++) {
                  var defaultData = [
                    survey.id,
                    'English',
                    j,
                    jsonData['QuestionText'][j],
                    "app/components/Survey/SurveyViews/matrixSurveyView.json",
                    "matrix",
                  ]
                  dde.push(defaultData);
                }

                async.map(dde,
                  Question.insertQuestion,
                  function (err) {
                    if (err)
                      console.log("Insert failed with error", err);
                    res.end();
                  }
                );
              }
            }

          });
        }
      }
      res.end();
    });
  },

  /**
   * This route get a survey by name and specific section of questions.
   * Also allows options parameters to be set.
   * @param  {[type]} req  [description]
   * @param  {[type]} res) {                   var surveyName [description]
   * @return {[type]}      [description]
   */
  getSurveyWithOptions: (req, res) => {
    var surveyName = req.params.surveyName;
    var range = [Math.max(0, Math.min(req.params.low, req.params.high)), Math.max(req.params.low, req.params.high)];

    var options = SurveyBuilder.setDisplaySurveyOptions(req.params.questionsPerPage, req.params.splitQuestionTypes, range);

    Survey.getSurvey(surveyName, function (err, surveyData) {
      if (err) {
        Logger.error(err);
      } else if (surveyData.length >= 1 && surveyData[0].surveyName == surveyName) {
        SurveyBuilder.getSurveySection(surveyData, options, function (err, data) {
          var sqs = JSON.stringify(data);
          res.send(sqs);
          res.end();
        });
      } else {
        res.end();
      }
    });
  },

  //Helpful little route to create survey prefernces, not sure this will live on.
  setPreferences: (req, res) => {
    var userId = req.user.id || req.passport.user;
    SurveyBuilder.setSignupSurveyPreferences( userId, function(err,data) {
        res.end();
    });
  },
};