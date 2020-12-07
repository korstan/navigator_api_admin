const BuildingRoute = require('./building');
const LocationRoute = require('./location');

module.exports = (app) => {
  app.use(BuildingRoute.routes());
  app.use(LocationRoute.routes());
}
