const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
   return knex.schema
    .alterTable(dbcfg.student_assignment_task_table, (t) => {
        t.unique(['studentId','assignmentTaskId'], 'student_assignmentId')
    })
    .alterTable(dbcfg.preferences_table, (t) => {
        t.unique(['userId','toolName'], 'userTool')
    })
    .alterTable(dbcfg.survey_preferences_table, (t) => {
        t.unique(['surveyId','userId'], 'survey_userIds')
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
  .dropTable(dbcfg.student_assignment_task_table)
  .dropTable(dbcfg.preferences_table)
  .dropTable(dbcfg.survey_preferences_table)
};
