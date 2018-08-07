const { Model } = require('objection');


class TaskDecompTask extends Model {
  /* Name getter */
  static get tableName() {
    return 'task_decomposition_tasks';
  }
  
};

module.exports.TaskDecompTask = TaskDecompTask;