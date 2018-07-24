const { Model } = require('objection');

class StudentSkill extends Model {
  /* Name getter */
  static get tableName() {
    return 'student_skill';
  }
  /* Relationships */
  static get relationMappings() {
    const { Student } = require('./student');
    const { CourseSkill } = require('./courseSkill');

    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Student,
        join: {
          from: 'student_skill.studentId',
          to: 'student.id'
        },
      },
      classSkill: {
        relation: Model.BelongsToOneRelation,
        modelClass: CourseSkill,
        join: {
          from: 'student_skill.classSkillId',
          to: 'class_skill.id'
        }
      }
    };
  };
};

module.exports = StudentSkill;