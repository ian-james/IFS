const { Model } = require('objection');


class TaskDecompBase extends Model {
  /* Name getter */
  static get tableName() {
    return 'task_decomposition_base';
  }
  
};

module.exports.TaskDecompBase = TaskDecompBase;