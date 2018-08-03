const { Model } = require('objection');

class Assignment extends Model {
  /* Name getter */
  static get tableName() {
    return 'assignment';
  }
  /* Relationships */
  static get relationMappings() {
    const { AssignmentTask } = require ('./assigmentTask');
    const { Course } = require('./course');  
    const {TaskDecompBase} = require('./taskDecompBase');
    
    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: AssignmentTask,
        join: {
          from: 'assignment.id',
          to: 'assignment_task.assignmentId'
        },
      },
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'assignment.classId',
          to: 'class.id'
        },
      },

      decomp:{
        relation: Model.HasManyRelation,
        modelClass: TaskDecompBase,
        join: {
          from: 'assignment.id',
          to: 'task_decomposition_base.assignmentId'
        }
      }


    };
  };
};

module.exports = Assignment;