const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
   return knex.schema
    .alterTable(dbcfg.student_table, (t) => {
        t.integer('age').unsigned();
    })
    .alterTable(dbcfg.student_table, (t) => {
        t.integer('yearOfStudy').unsigned();
    })
    .alterTable(dbcfg.student_table, (t) => {
        t.enu('gender', ["Prefer not to say", "Female", "Male", "Other" ]).defaultTo("Prefer not to say").notNull()
    })
};

exports.down = function(knex, Promise) {

    return knex.schema
  .dropTable(dbcfg.student_table)
};
