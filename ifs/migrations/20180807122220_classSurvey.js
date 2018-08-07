
exports.up = function(knex, Promise) {
  return knex.schema.createTable('class_survey', (t) => {
    t.increments('id').primary()
    t.integer('classId').unsigned().notNull().references('id').inTable('class')
    t.integer('surveyId').unsigned().notNull().references('id').inTable('survey')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('class_survey');
};
