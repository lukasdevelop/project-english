
exports.up = function(knex) {
  return knex.schema.createTable('users',function(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('facebook');
    table.string('github').notNullable();
    table.integer('code').default(null);
    table.integer('status').default(0);
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
