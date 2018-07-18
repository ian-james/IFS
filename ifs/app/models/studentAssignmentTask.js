const { Model } = require('objection');

class StudentAssignmentTask extends Model {
  /* Name getter */
  static get tableName() {
    return 'student_assignment_task';
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

module.exports = StudentAssignmentTask;