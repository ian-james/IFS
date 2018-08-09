const { Model } = require('objection');

class Student extends Model {
  /* Name getter */
  static get tableName() {
    return 'student';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');
    const { StudentAssignmentTask } = require('./studentAssignmentTask');
    const { StudentClass } = require('./studentClass');
    const { StudentSkill } = require('./studentSkill');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'student.userId',
          to: 'user.id'
        },
      },
      assignmentTasks: {
        relation: Model.HasManyRelation,
        modelClass: StudentAssignmentTask,
        join: {
          from: 'student.id',
          to: 'student_task_assignment.studentId'
        }
      },
      courses: {
        relation: Model.HasManyRelation,
        modelClass: StudentClass,
        join: {
          from: 'student.id',
          to: 'student_class.studentId'
        }
      },
      skills: {
        relation: Model.HasManyRelation,
        modelClass: StudentSkill,
        join: {
          from: 'student.id',
          to: 'student_skill.studentId'
        }
      }
    };
  };
};

const getStudentIdForUser = async (userId) => {
  const student = await Student.query()
    .select('id')
    .where('userId', userId)
    .first();
  return student.id;
}

module.exports.Student = Student;
module.exports.getStudentIdForUser = getStudentIdForUser;