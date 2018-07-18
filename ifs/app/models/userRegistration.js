const { Model } = require('objection');

class UserRegistration extends Model {
  /* Name getter */
  static get tableName() {
    return 'user_registration';
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

module.exports = UserRegistration;