const knex = require('../connection');

module.exports = {
  getAllByBuildingId(buildingId) {
    return knex('locations')
      .where({ buildingId })
      .select();
  },
  create(newLocation) {
    return knex('locations')
      .returning('*')
      .insert(newLocation);
  },
  update(location) {
    return knex('locations')
      .where('id', location.id)
      .update(location, ['level', 'title', 'x_entry', 'y_entry', 'pathPointId']);
  },
  removeById(id) {
    return knex('locations')
      .where('id', id)
      .del();
  },
  removePathPointIdReferences(pathPointId) {
    return knex('locations')
      .where('pathPointId', pathPointId)
      .update({pathPointId: null});
  }
}