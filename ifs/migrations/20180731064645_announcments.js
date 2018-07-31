const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
  return knex.schema
  .createTable(dbcfg.announcements_table, (t) => {
    t.increments('id').primary();
    t.string('title', 100).notNull();
    t.text('body').notNull();
    t.date('expiryDate').defaultTo(null);
    t.integer('classId').unsigned().references('id').inTable('class')
    t.timestamps(true, true);
  })
  .createTable(dbcfg.announcement_exposure_table, (t) => {
    t.increments('id').primary();
    t.integer('userId').unsigned().references('id').inTable('users')
    t.integer('announcementId').unsigned().references('id').inTable('announcements').onDelete('CASCADE')
    t.dateTime('viewDate').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
  .dropTable('announcement_exposure')
  .dropTable('announcements')
};
