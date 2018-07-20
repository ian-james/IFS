const { Model } = require('objection');

class AssignmentTask extends Model {
  /* Name getter */
  static get tableName() {
    return 'assignment_task';
  }

  static get relationMappings() {
    const { Assignment } = require('./assignment');
    const { StudentAsssignmentTask } = require('./studentAssignmentTask');

    return {
      assignment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Assignment,
        join: {
          from: 'assignment_task.assignmentId',
          to: 'assignment.id'
        },
      },
      studentTasks: {
        relation: Model.HasManyRelation,
        modelClass: StudentAsssignmentTask,
        join: {
          from: 'assignment_task.id',
          to: 'student_assignment_task.assignmentTaskId'
        }
      }
    };
  };
};

module.exports = AssignmentTask;