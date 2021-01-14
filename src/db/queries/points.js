const knex = require('../connection');

module.exports = {
  create(newPoints) {
    return knex('points')
      .returning('*')
      .insert(newPoints);
  },
  update(points) {
    return knex('points')
      .where('locationId', points.locationId)
      .update(points, ['locationId', 'x1', 'y1'])
  },
  removeByLocationId(locationId) {
    return knex('points')
      .where('locationId', locationId)
      .del();
  },
}