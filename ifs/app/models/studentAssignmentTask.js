const { Model } = require('objection');

class StudentAssignmentTask extends Model {
  /* Name getter */
  static get tableName() {
    return 'student_assignment_task';
  }
  /* Relationships */
  static get relationMappings() {
    const { Student } = require('./student');
    const { AssignmentTask } = require('./assignmentTask');

    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Student,
        join: {
          from: 'student_assignment_task.studentId',
          to: 'student.id'
        },
      },
      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: AssignmentTask,
        join: {
          from: 'student_assignment_task.assignmentTaskId',
          to: 'assignment_task.id'
        }
      }
    };
  };
};

module.exports = StudentAssignmentTask;