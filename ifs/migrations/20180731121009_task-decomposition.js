const dbcfg = require('../config/databaseConfig');


exports.up = function(knex, Promise) {
	return knex.schema
	  .createTable(dbcfg.task_decomposition_base_table, (t) => {
	    t.increments('id').primary()
	    t.integer('userId').unsigned().references('id').inTable('users')
	    t.string('question', 255).notNull()
	    t.dateTime('dueDate').defaultTo(knex.fn.now())
	    t.enu('comfort', ['Low', 'Medium', 'High'])
	    t.integer('numComponents').unsigned().notNull()
	    t.integer('assignmentId').unsigned().references('id').inTable('assignment')
	  })
	  .createTable(dbcfg.task_decomposition_modules_table, (t) => {
	  	t.increments('id').primary()
	  	t.integer('baseId').unsigned().references('id').inTable('task_decomposition_base')
	  	t.string('name', 255).notNull()
	  	t.time('expectedLength')
	  	t.integer('difficulty').unsigned().notNull()
	  })
	  .createTable(dbcfg.task_decomposition_tasks_table, (t) => {
	  	t.increments('id').primary()
	  	t.integer('moduleId').unsigned().references('id').inTable('task_decomposition_modules')
	  	t.string('tasks', 255).notNull()
	  })
};

exports.down = function(knex, Promise) {
  return knex.schema
  .dropTable('task_decomposition_base')
  .dropTable('task_decomposition_modules')
  .dropTable('task_decomposition_tasks')
};
