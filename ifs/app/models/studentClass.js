const { Model } = require('objection');

class StudentClass extends Model {
  /* Name getter */
  static get tableName() {
    return 'student_class';
  }
  /* Relationships */ 
  static get relationMappings() {
    const { Student } = require('./student');
    const { Course } = require('./course');

    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Student,
        join: {
          from: 'student_class.studentId',
          to: 'student.id'
        },
      },
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'student_class.classId',
          to: 'class.id'
        }
      }
    };
  };
};

module.exports.StudentClass = StudentClass;