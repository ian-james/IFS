const { Model } = require('objection');

class UserRole extends Model {
  /* Name getter */
  static get tableName() {
    return 'user_role';
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

module.exports = UserRole;