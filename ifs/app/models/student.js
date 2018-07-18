const { Model } = require('objection');

class Student extends Model {
  /* Name getter */
  static get tableName() {
    return 'student';
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

module.exports = Student;