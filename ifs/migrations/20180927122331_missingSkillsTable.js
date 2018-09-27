const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
    return knex.schema
    .createTable(dbcfg.skills_table, (t) => {
        t.increments('id').primary();
        t.string('name', 40).notNull().unique()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable(dbcfg.skill_table);
};
