const { Model } = require('objection');


class TaskDecompBase extends Model {
  /* Name getter */
  static get tableName() {
    return 'task_decomposition_base';
  }
  /* Relationships */
  static get relationMappings() {
    const { Assignment } = require('./assignment');
    const { User } = require('./user');

    return {
      assignment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Assignment,
        join: {
          from: 'task_decomposition_base.assignmentId',
          to: 'assignment.id'
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'task_decomposition_base.userId',
          to: 'user.id'
        }
      }
    };
  };
};

module.exports.TaskDecompBase = TaskDecompBase;