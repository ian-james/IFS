const { Model } = require('objection');

class SurveyResult extends Model {
  /* Name getter */
  static get tableName() {
    return 'survey_result';
  }
  /* Relationships */
  static get relationMappings() {
    const { Survey } = require('./survey');
    const User = require('./user');
    const Question = require('./question');

    return {
      survey: {
        relation: Model.BelongsToOneRelation,
        modelClass: Survey,
        join: {
          from: 'survey_result.surveyId',
          to: 'survey.id'
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'survey_result.userId',
          to: 'user.id'
        },
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'survey_result.questionId',
          to: 'questions.id'
        },
      },
    };
  };
};


module.exports.SurveyResult = SurveyResult;
