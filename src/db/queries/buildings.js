const knex = require('../connection');

module.exports = {
  getAll() {
    return knex('buildings')
      .select();
  },
  create(newBuilding) {
    return knex('buildings')
      .returning('*')
      .insert(newBuilding);
  }
}