const { Model } = require('objection');


class TaskDecompModule extends Model {
  /* Name getter */
  static get tableName() {
    return 'task_decomposition_modules';
  }
  
};

module.exports.TaskDecompModule = TaskDecompModule;