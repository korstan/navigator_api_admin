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
      const { buildingId, title, level, x, y, x_entry, y_entry } = ctx.request.body;
      const [newLocation] = await Query.Locations.create({
        buildingId,
        title,
        level,
        x_entry,
        y_entry
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
          },
          entryPoints: {
            x: newLocation.x_entry,
            y: newLocation.y_entry,
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

router.put('/:id/edit', async (ctx, next) => {
  try {
    const id = ctx.params.id;
    const reqBody = ctx.request.body;
    const [points] = await Query.Points.update({ locationId: id, x1: reqBody.x, y1: reqBody.y });
    const [location] = await Query.Locations.update({ 
      id, 
      title: reqBody.title, 
      level: reqBody.level, 
      x_entry: reqBody.x_entry || null, 
      y_entry: reqBody.y_entry || null
    });
    ctx.body = { 
      id,
      level: location.level,
      title: location.title,
      x: points.x1,
      y: points.y1,
      x_entry: location.x_entry,
      y_entry: location.y_entry,
    };
    ctx.status = 200;
  } catch (error) {
    ctx.body = { error: { message: 'Internal Server Error' } };
    ctx.status = 500;
  }
  await next();
});

router.delete('/:id/remove', async (ctx, next) => {
  try {
    const id = ctx.params.id;
    await Query.Points.removeByLocationId(id);
    await Query.Locations.removeById(id);
    ctx.body = { id };
    ctx.status = 200;
  } catch (error) {
    ctx.body = { error: { message: 'Internal Server Error' } };
    ctx.status = 500;
  }
  await next();
});

module.exports = router;
