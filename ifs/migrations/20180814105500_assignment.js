const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
  return knex.schema
  .alterTable(dbcfg.feedback_table, (t) => {
  	t.integer('assignmentID').unsigned();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
  .dropTable('assignment')
};
