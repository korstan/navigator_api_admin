const knex = require('../connection');

module.exports = {
  create(newPoint) {
    return knex('pathPoints')
      .returning('*')
      .insert(newPoint);
  },
  update(id,point) {
    return knex('pathPoints')
      .where('id',id)
      .update(point, ['id', 'buildingId', 'level', 'title', 'x', 'y'])
  },
  removeById(id) {
    return knex('pathPoints')
      .where('id', id)
      .del();
  },

  //links
  makeLink(fromPointId, toPointId) {
    console.log(`make link from ${fromPointId} to ${toPointId}`);
    return knex('pathLinks')
      .insert({fromPointId, toPointId});
  },
  removeAllPointLinks(pointId) {
    return knex('pathLinks')
      .where('fromPointId', pointId)
      .orWhere('toPointId', pointId)
      .del();
  }
}