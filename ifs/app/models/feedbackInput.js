const { Model } = require('objection');

class FeedbackInput extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback_input';
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

module.exports = FeedbackInput;