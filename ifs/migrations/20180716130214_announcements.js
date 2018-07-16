
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('announcements', (t) => {
      t.increments('id').primary();
      t.string('title', 100).notNull();
      t.text('body').notNull();
      t.dateTime('expiryDate').defaultTo(null);
      t.integer('classId').unsigned().references('id').inTable('class').onDelete('CASCADE');
      t.timestamps(true, true);
    }),

    knex.schema.createTable('announcement_exposure', (t) => {
      t.increments('id').primary();
      t.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
      t.integer('announcementId').unsigned().references('id').inTable('announcements').onDelete('CASCADE');
      t.dateTime('viewDate').defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('announcements');
};
