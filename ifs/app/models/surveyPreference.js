const { Model } = require('objection');

class SurveyPreference extends Model {
  /* Name getter */
  static get tableName() {
    return 'survey_preferences';
  }
  /* Relationships 
  static get relationMappings() {
    return {
      exposures: {
        relation: Model.HasManyRelation,
        modelClass: AnnouncementExposure,
        join: {
          from: 'announcements.id',
          to: 'announcement_exposure.announcementId'
        },
      },
    };
  };*/
};

module.exports = SurveyPreference;