const path = require('path');
const _ = require('lodash');
const viewPath = path.join(__components, 'SurveyAdmin/views/');
const { Survey } = require(path.join(__modelPath, 'survey'));
const { Question } = require(path.join(__modelPath, 'question'));

module.exports = {
  /* Post request for creating a new Survey/associating questions */
  createSurveyAndQuestions: async (req, res) => {
    console.log(req.body);
    
    if (!req.files) {
      return res.status(400).send({msg: 'No question set uploaded'});
    }
    
    const questionSet = req.files.fullSurveyFile;
    const questionJSON = JSON.parse(questionSet.data);
    const questions = questionJSON.QuestionText

    const survey = await Survey.query()
      .insert({
        surveyName: req.body.surveyName,
        authorNames: req.body.authorNames,
        title: req.body.title,
        surveyField: req.body.surveyField,
        totalQuestions: questions.length,
        surveyFreq: 'reg',
        fullSurveyFile: questionSet.name
      })

      for (i = 0; i < questions.length; i++) {
        await Question.query()
          .insert({
            surveyId: survey.id,
            language: 'english',
            origOrder: i + 1,
            text: questions[i],
            visualFile: questionSet.name,
            type: 'matrix'
          });
      }    
      res.end();
  },
  createSurveyForm: (req, res) => {
    res.render(path.join(viewPath,'createForm'), {});
  }
};
