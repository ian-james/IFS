const { Model } = require('objection');

class FeedbackStats extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback_stats';
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

module.exports = FeedbackStats;