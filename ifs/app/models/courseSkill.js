const { Model } = require('objection');

class CourseSkill extends Model {
  /* Name getter */
  static get tableName() {
    return 'class_skill';
  }
  /* Relationships */
  static get relationMappings() {
    const { Course } = require('./course');
    const { Assignment } = require('./assignment');
    const { StudentSkill } = require('./studentSkill');

    return {
      course: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'class_skill.classId',
          to: 'class.id'
        },
      },
      assignment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Assignment,
        join: {
          from: 'class_skill.assignmentId',
          to: 'assignment.id'
        },
      },
      studentsWithSkill: {
        relation: Model.HasManyRelation,
        modelClass: StudentSkill,
        join: {
          from: 'class_skill.id',
          to: 'student_skill.classSkillId'
        }
      }
    };
  };
};

module.exports = CourseSkill;