const Router = require('@koa/router');

const BASE_PATH = '/api/location';
const router = new Router({ prefix: BASE_PATH });

const Query = {
  Buildings: require('../../db/queries/buildings'),
  Locations: require('../../db/queries/locations'),
  Points: require('../../db/queries/points'),
};

router.post('/new', async (ctx, next) => {
  try {
    if (ctx.request.body.buildingId && ctx.request.body.title && ctx.request.body.level && ctx.request.body.x && ctx.request.body.y) {
      const { buildingId, title, level, x, y } = ctx.request.body;
      const [newLocation] = await Query.Locations.create({
        buildingId,
        title,
        level
      });
      const [newLocationPoints] = await Query.Points.create({
        locationId: newLocation.id,
        x1: x,
        y1: y,
      });
      ctx.status = 200;
      ctx.body = {
        level: newLocation.level,
        location: {
          id: newLocation.id,
          title: newLocation.title,
          points: {
            x1: newLocationPoints.x1,
            y1: newLocationPoints.y1,
          }
        }
      };
    } else {
      ctx.status = 400;
      ctx.body = { error: { message: 'Bad Request' } };
    }
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { error: { message: 'Internal Server Error' } };
  }
});

module.exports = router;
