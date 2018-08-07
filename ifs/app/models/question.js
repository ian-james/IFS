const { Model } = require('objection');

class Question extends Model {
  /* Name getter */
  static get tableName() {
    return 'questions';
  }
  /* Relationships */
  static get relationMappings() {
    const { Survey } = require('./survey');
    const { SurveyResult } = require('./surveyResult')

    return {
      survey: {
        relation: Model.BelongsToOneRelation,
        modelClass: Survey,
        join: {
          from: 'questions.surveyId',
          to: 'survey.id'
        },
      },
      results: {
        relation: Model.HasManyRelation,
        modelClass: SurveyResult,
        join: {
          from: 'questions.id',
          to: 'survey_result.questionId'
        }
      }
    };
  };
};

getResponseCount = async (surveyId) => {
  const result = await Question.query()
    .select([
      'questions.text',
      'questions.id',
      (b) => {
        b.count({ones: 'questions.id'})
          .where('questionAnswer', '=', 1)
      }
    ])
    .leftJoin('survey_result', 'questions.id', 'survey_result.questionId')
    .groupBy('questions.text')
    .where('survey_result.surveyId', surveyId)
    return result;
};

module.exports.Question = Question;
module.exports.getResponseCount = getResponseCount;