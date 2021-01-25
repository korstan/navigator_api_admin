const BuildingRoute = require('./building');
const LocationRoute = require('./location');
const PathPointsRoute = require('./pathPoints');

module.exports = (app) => {
  app.use(BuildingRoute.routes());
  app.use(LocationRoute.routes());
  app.use(PathPointsRoute.routes());
}
