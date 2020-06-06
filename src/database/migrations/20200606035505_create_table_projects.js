
exports.up = function(knex) {
  return knex.schema.createTable('projects', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('author').notNullable();
    table.integer('votes').default(0);
    table.integer('status').default(0);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('projects')
};
