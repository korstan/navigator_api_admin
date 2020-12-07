const knex = require('../connection');

module.exports = {
  create(newLocation) {
    return knex('locations')
      .returning('*')
      .insert(newLocation);
  }
}