
exports.up = function(knex) {
  return knex.schema.createTable('forum', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('imagem');
    table.integer('id_user').unsigned().notNullable();
    table.integer('id_project').unsigned();
    table.foreign('id_user').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('id_project').references('id').inTable('projects').onDelete('CASCADE');

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('forum')
};
