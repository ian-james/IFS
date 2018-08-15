const { Model } = require('objection');

class SurveyPreference extends Model {
  /* Name getter */
  static get tableName() {
    return 'survey_preferences';
  }
  /* Relationships */
  static get relationMappings() {
    const { Survey }  = require('./survey');
    const { User } = require('./user');

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
          to: 'users.id'
        }
      }
    };
  };
};

const resetPulseProgress = async (userId) => {
  await SurveyPreference.query()
    .patch( {
      'currentIndex': 0
    })
    .where('userId', userId);
};

module.exports.SurveyPreference = SurveyPreference;
module.exports.resetPulseProgress = resetPulseProgress;