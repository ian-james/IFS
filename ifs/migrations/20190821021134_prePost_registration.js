const dbcfg = require('../config/databaseConfig');

/**
 * These change incldues a new table for registering pre/post test dates.
 * User registration is setup to be tracked, it's partially observable via login sessions.
 */

exports.up = function(knex, Promise) {
    return knex.schema
    .alterTable(dbcfg.user_registration_table, (t) => {
       t.date('registrationDate').defaultTo(null);
    })
    .createTable(dbcfg.prePostSurvey_table,  (t) => {
       t.increments('id').primary()
       t.integer('userId').unsigned().references('id').inTable('users').notNull();
       t.integer('surveyId').unsigned().references('id').inTable('survey').notNull();
       t.string('testName', 40).notNull();
       t.string('surveyName', 60).notNull().references('surveyName').inTable('survey').notNull();
       t.timestamp('testCompletedDate').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable(dbcfg.user_registration_table);
};

