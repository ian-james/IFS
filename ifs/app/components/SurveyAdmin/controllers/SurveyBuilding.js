const path = require('path');
const _ = require('lodash');
const viewPath = path.join(__components, 'SurveyAdmin/views/');
const { Survey } = require(path.join(__modelPath, 'survey'));
const { Question } = require(path.join(__modelPath, 'question'));

module.exports = {
  /* Post request for creating a new Survey/associating questions */
  createSurveyAndQuestions: async (req, res) => {
    if (!req.file) {
      return res.status(400).send({msg: 'No question set uploaded'});
    }
    const questionSet = req.file.buffer;
    const questionJSON = JSON.parse(questionSet);
    const questions = questionJSON.QuestionText
    const survey = await Survey.query()
      .insert({
        surveyName: req.body.surveyName,
        authorNames: req.body.authorNames,
        title: req.body.title,
        surveyField: req.body.surveyField,
        totalQuestions: questions.length,
        surveyFreq: req.body.surveyFreq,
        fullSurveyFile: req.file.originalname
      });
    /* Insert parsed questions associated with new survey */

    _.map(questions, async (question, index) => {
      await Question.query()
        .insert({
          surveyId: survey.id,
          language: 'english',
          origOrder: index + 1,
          text: question,
          visualFile: req.file.originalname,
          type: 'matrix'
        });
    });

    const surveys = await Survey.query();
    res.render(path.join(viewPath, 'surveyList'), {
      title: 'Survey Management',
      surveys: surveys
    });
  },
  createSurveyForm: (req, res) => {
    res.render(path.join(viewPath,'createForm'), {});
  }
};
