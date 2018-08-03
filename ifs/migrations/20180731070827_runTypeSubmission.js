
exports.up = function(knex, Promise) {
  return knex.schema.table('submission', (t) => {
    t.text('runType').defaultTo(null)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('submission', (t) => {
    t.dropColumn('runType')
  })
};
