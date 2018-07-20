const { Model } = require('objection');

class Questions extends Model {
  /* Name getter */
  static get tableName() {
    return 'questions';
  }
  /* Relationships */
  static get relationMappings() {
    const { Survey } = require('./survey');

    return {
      survey: {
        relation: Model.BelongsToOneRelation,
        modelClass: Survey,
        join: {
          from: 'questions.surveyId',
          to: 'survey.id'
        },
      },
    };
  };
};

module.exports = Questions;