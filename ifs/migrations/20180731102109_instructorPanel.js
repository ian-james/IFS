const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable(dbcfg.class_choices_table, (t) => {
            t.increments('id').notNull().primary()
            t.integer('classId').unsigned()
            t.integer('optionId').unsigned()
        })
        .createTable(dbcfg.class_options_table, (t) => {
            t.increments('id').notNull().primary()
            t.string('fieldName', 45).notNull().unique()
            t.string('name', 45).notNull()
            t.string('fieldType', 45).notNull()
            t.string('disciplineType', 45).notNull()
        })

        .createTable(dbcfg.assignment_choices_table, (t) => {
            t.increments('id').notNull().primary()
            t.integer('assignmentId').unsigned()
            t.integer('optionId').unsigned()
        })

        .createTable(dbcfg.assignment_options_table, (t) => {
            t.increments('id').notNull().primary()
            t.string('fieldName', 45).notNull().unique()
            t.string('name', 45).notNull()
            t.string('fieldType', 45).notNull()
            t.string('disciplineType', 45).notNull()
        })

        .table(dbcfg.class_table, (t) => {
            t.integer('instructorId').references('id').inTable('users').unsigned().notNull()
        })

        .table(dbcfg.ifs_tips_table, (t) => {
            t.boolean('instructor').defaultTo(0)
        })
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTableIfExists(dbcfg.class_choices_table)

    .dropTableIfExists(dbcfg.class_options_table)

    .dropTableIfExists(dbcfg.assignment_choices_table)

    .dropTableIfExists(dbcfg.assignment_options_table)

    .table(dbcfg.class_table, (t) => {
        t.dropColumn('instructorId')
    })

    .table(dbcfg.ifs_tips_table, (t) => {
        t.dropColumn('instructor')
    })
};
