const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
  return knex.schema
  .table(dbcfg.task_decomposition_modules_table, (t) => {
    t.enu('initialComfort', ['No', 'Yes'])
    t.enu('endComfort', ['No', 'Yes'])
  })
  .table(dbcfg.task_decomposition_tasks_table, (t) => {
  	t.time('expectedLength')
  })
};

exports.down = function(knex, Promise) {
};
