const { Model } = require('objection');

class Course extends Model {
  /* Name getter */
  static get tableName() {
    return 'class';
  }
  /* Relationships */
  static get relationMappings() {
    const { CourseSkill } = require('./courseSkill');
    const { StudentClass } = require('./studentClass');
    const { UpcomingEvent } = require('./upcomingEvent');

    return {
      skills: {
        relation: Model.HasManyRelation,
        modelClass: CourseSkill,
        join: {
          from: 'class.id',
          to: 'class_skill.classId'
        },
      },
      students: {
        relation: Model.HasManyRelation,
        modelClass: StudentClass,
        join: {
          from: 'class.id',
          to: 'student_class.classId'
        }
      },
      events: {
        relation: Model.HasManyRelation,
        modelClass: UpcomingEvent,
        join: {
          from: 'class.id',
          to: 'upcoming_event.classId'
        }
      }
    };
  };
};

module.exports.Course = Course;