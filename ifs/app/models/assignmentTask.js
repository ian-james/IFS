const { Model } = require('objection');

class AssignmentTask extends Model {
  /* Name getter */
  static get tableName() {
    return 'assignment_task';
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

module.exports = AssignmentTask;