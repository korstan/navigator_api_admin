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
  },
  update(building) {
    return knex('buildings')
      .where('id', building.id)
      .update(building, ['id', 'title'])
  },
  removeById(id) {
    return knex('buildings')
      .where('id', id)
      .del();
  }
}