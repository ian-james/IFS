const dbcfg = require('../config/databaseConfig');


exports.up = function(knex, Promise) {
    return knex.schema
    .alterTable(dbcfg.class_table, (t) => {
        t.integer('year').notNull().defaultTo( 2018 )
        t.string('semester',10).notNull().defaultTo("Fall")
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable(dbcfg.class_table);
};
