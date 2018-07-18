const { Model } = require('objection');

class FeedbackRating extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback_rating';
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

module.exports = FeedbackRating;