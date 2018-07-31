const dbcfg = require('../config/databaseConfig');


exports.up = function(knex, Promise) {
  return knex.schema
    .createTable(dbcfg.questionnaire_table, (t) => {
      t.increments('id').primary()
      t.string('question', 255).notNull()
      t.string('answer', 255).notNull()
      t.timestamp('date').defaultTo(knex.fn.now())

    })
    
};

exports.down = function(knex, Promise) {
  	return knex.schema
    .dropTable('questionnaire')
};
