const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
  return knex.schema
  .table(dbcfg.task_decomposition_base_table, (t) => {
    t.integer('index').unsigned().notNull().defaultTo(0)
  })
};

exports.down = function(knex, Promise) {
};
