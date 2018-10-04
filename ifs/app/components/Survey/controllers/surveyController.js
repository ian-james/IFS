/* Packages */
const moment = require('moment');
const path = require('path');
const _ = require('lodash');
const async = require('async');
/* Modules */
const componentPath = path.join(__components, "Survey");
const viewPath = path.join(__components, 'Survey/views/');
const SurveyManager = require(path.join(componentPath, "helpers/surveyManager"));
const SurveyBuilder = require(path.join(componentPath, "helpers/surveyBuilder"));
const Logger = require(__configs + "loggingConfig");
const event = require(__components + "InteractionEvents/buildEvent.js");
const tracker = require(__components + "InteractionEvents/trackEvents.js");
const SurveyResponse = require(__components + "Survey/models/surveyResponse");
const Errors = require(__components + "Errors/errors");
const Serializers = require(path.join(componentPath, 'helpers/Serializer.js'));
/* Models */
const Survey = require(__components + "/Survey/models/survey");
const SurveyPreferences = require(path.join(componentPath, 'models/surveyPreferences'));
const Question = require(__components + "Survey/models/question");
const { optedIn } = require(path.join(__modelPath, 'preferences'));
const { getAvailableSurveys } = require(path.join(__modelPath,'survey'));
const { getStudentIdForUser } = require(path.join(__modelPath, 'student'));
const { getQuestionOrder } = require(path.join(__modelPath, 'question'));

module.exports = {
  /* Returns a list of surveys */
  surveyList: async (req, res) => {
    const userId = req.user.id;

    if (await optedIn(userId)) {
      const studentId = await getStudentIdForUser(userId);
      let surveys = await getAvailableSurveys(studentId);
      /* Format date so pug will play nice */
      surveys = _.map(surveys, (obj) => {
        const rev = obj['lastRevision'];
        if (rev)
          obj['lastRevision'] = moment(obj['lastRevision']).format("hh:mm a DD-MM-YYYY");
        return obj;
      });

      res.render(viewPath + 'surveyList', {
        'title': "Survey List",
        "surveys": surveys
      });
    } else {
      res.render(viewPath + 'surveyList', {
        'title': "Survey List",
        "surveys": []
      });
    }
  },
  /**
   * This function receives the survey data from SurveyJS and parses it and
   * updates the databases with relevenat information.
   * @param  {[type]} req  [description]
   * @param  {[type]} res) {                   try {            var title [description]
   * @return {[type]}      [description]
   */
  sendSurveyData: async (req, res) => {
    try {
      const title = req.body.title;
      const results = req.body.result;
      const isPulse = req.body.isPulse;

      Survey.getSurveyByTitle(title, function (err, data) {
        if (err) {
          Logger.error("ERRR< GETTING TITLE", err);
        }
        if (data && data.length > 0) {
          const surveyId = data[0].id;
          const userId = req.user.id || req.passport.user;
          SurveyPreferences.getSurveyPreferences(userId, surveyId, async function (err, surveyPrefData) {
            if (err) {
              Logger.error("Unable to get Survey Preferences");
              return;
            }

            const surveyIndex = surveyPrefData[0].currentSurveyIndex;
            const surveyLastIndex = data[0].numQ;

            const resultsToDb = [];
            let qids = [];
            let answers = [];
            let lastId = 0;

            // For each Question section, get question key and value into a single array.
            // ex) sews1 value 1
            const ks = Object.keys(results);

            for (let i = 0; i < ks.length; i++) {
              let k = ks[i];
              qids = qids.concat(_.keys(results[k]));
              answers = answers.concat(_.values(results[k]));
            }
            // Get the index of the last question answered.
            for (let i = 0; i < qids.length && i < answers.length; i++) {

              const qid = qids[i];
              var m = qid.toString().match(/[a-zA-Z]*(\d*)/);
              if (m && m.length > 1) {
                lastId = Math.max(lastId, parseInt(m[1]));
              }
            }
            // IF all the questions where submitted we increment the surveyIndex because it will need to be a 'new'
            //  survey. Even if the old survey was in progress.
            if (resultsToDb.length == surveyLastIndex)
              surveyIndex++;

            // Organize results for survey response database.
            for (var i = 0; i < qids.length && i < answers.length; i++) {
              resultsToDb.push([userId, surveyId, qids[i], answers[i], surveyIndex, isPulse]);
            }

            // Insert the response to the survey into DB.
            async.map(resultsToDb,
              SurveyResponse.insertSurveyResponse,
              function (err, d) {
                if (err) {
                  Logger.error("ERROR: inserting Survey Response");
                }
              }
            );

            const curIndex = await getQuestionOrder(lastId);

            tracker.trackEvent(global.ioGlob, event.surveyEvent(req.user.sessionId, req.user.id, "addSection", {
              "surveyId": surveyId,
              "questionIds": qids,
              "questionsAnswered": qids.length,
              "lastQuestion": lastId,
              "surveyIndex": surveyIndex
            }));

            // Set the Preferences question Index
            SurveyPreferences.setQuestionCounter(userId, surveyId, curIndex, function (err, qData) {
              if (err)
                Logger.error("Unable to increment survey counter:" + surveyId + ": userId" + userId);
              });

              // Check if survey was finished update counter, user survey preferences.
              if ( lastId == surveyLastIndex) {
                SurveyPreferences.incrementSurveyIndex(userId, surveyId, function (err, qData) {
                  if (err)
                    Logger.error("Unable to increment survey counter:" + surveyId + ": userId" + userId);
                });
              }
          });
        }
      });
    } catch (e) {
      Logger.error("Could not save data from survey");
      res.writeHead(400, {
        'Content-Type': 'application/json'
      });
      res.json(Errors.cErr("Could not save data from survey"));
      res.end();
    }
  },

  getMatrixFromDB: (req, res) => {
    const id = req.params.surveyID;

    Survey.getSurveyId(id, (err, surveyMeta) => {
      if (err || !surveyMeta) {
        res.render(viewPath + "questionsLayout", {
          "title": 'Survey',
          "surveyQuestions": []
        });
      } else {
        Question.getQuestions(id, (err, questions) => {
          let loadedSurvey = Serializers.serializeSurvey(surveyMeta, questions, Serializers.matrixSerializer);
          loadedSurvey = JSON.stringify(loadedSurvey);
          res.render(viewPath + "questionsLayout", {
            "title": 'Survey',
            "surveyQuestions": loadedSurvey
          });
        });
      }
    });
  },
};