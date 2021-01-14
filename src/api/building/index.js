const Router = require('@koa/router');

const BASE_PATH = '/api/building';
const router = new Router({ prefix: BASE_PATH });

const Query = {
  Buildings: require('../../db/queries/buildings'),
  Locations: require('../../db/queries/locations'),
  Points: require('../../db/queries/points')
};

router.post('/new', async (ctx, next) => {
  try {
    if (ctx.request.body.title) {
      const { title } = ctx.request.body;
      const [newBuilding] = await Query.Buildings.create({ title });
      ctx.status = 200;
      ctx.body = newBuilding;
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
    const reqBody = ctx.request.body;
    const [building] = await Query.Buildings.update(reqBody);
    ctx.body = building;
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
    const locations = await Query.Locations.getAllByBuildingId(id);
    for(let location of locations) {
      await Query.Points.removeByLocationId(location.id);
      await Query.Locations.removeById(location.id);
    }
    await Query.Buildings.removeById(id);
    ctx.body = { id };
    ctx.status = 200;
  } catch (error) {
    ctx.body = { error: { message: 'Internal Server Error' } };
    ctx.status = 500;
  }
  await next();
});

module.exports = router;
