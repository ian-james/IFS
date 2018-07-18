const { Model } = require('objection');

class Assignment extends Model {
  /* Name getter */
  static get tableName() {
    return 'assignment';
  }
  /* Relationships */
  static get relationMappings() {
    const { AssignmentTask } = require ('./assigmentTask');
    return {
      exposures: {
        relation: Model.HasManyRelation,
        modelClass: AssignmentTask,
        join: {
          from: 'assignment.id',
          to: 'assignmentTask.assignmentId'
        },
      },
    };
  };
};

module.exports = Assignment;