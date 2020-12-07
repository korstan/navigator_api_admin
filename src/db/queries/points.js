const knex = require('../connection');

module.exports = {
  create(newPoints) {
    return knex('points')
      .returning('*')
      .insert(newPoints);
  }
}