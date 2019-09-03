const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
  return knex.schema.createTable(dbcfg.class_survey_table, (t) => {
    t.increments('id').primary()
    t.integer('classId').unsigned().notNull().references('id').inTable('class')
    t.integer('surveyId').unsigned().notNull().references('id').inTable('survey')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(dbcfg.class_survey_table);
};
