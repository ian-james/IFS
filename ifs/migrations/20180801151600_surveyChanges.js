
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('class_surveys', (t) => {
      t.increments('id').primary()
      t.integer('classId').unsigned().notNull().references('id').inTable('class')
      t.integer('surveyId').unsigned().notNull().references('id').inTable('survey')
      t.boolean('isViewable').defaultTo(false).notNull()
    })
    .table('survey', (t) => {
      t.dropColumn('surveyName')
      t.dropColumn('fullSurveyFile')
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('class_surveys')
};
