const { Model } = require('objection');

class SurveyPreference extends Model {
  /* Name getter */
  static get tableName() {
    return 'survey_preferences';
  }
  /* Relationships */
  static get relationMappings() {
    const Survey  = require('./survey');
    const User = require('./user');

    return {
      survey: {
        relation: Model.BelongsToOneRelation,
        modelClass: Survey,
        join: {
          from: 'survey_preferences.surveyId',
          to: 'survey.id'
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'survey_preferences.userId',
          to: 'user.id'
        }
      }
    };
  };
};

module.exports = SurveyPreference;