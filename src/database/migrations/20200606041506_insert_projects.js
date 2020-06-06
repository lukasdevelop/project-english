
exports.up = function(knex) {
  return knex('projects').insert(
  {
    title: 'The News Facebook',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley.',
    author: 'John Richard'
  })
};

exports.down = function(knex) {

};
