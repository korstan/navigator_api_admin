const Router = require('@koa/router');

const BASE_PATH = '/api/building';
const router = new Router({ prefix: BASE_PATH });

const Query = {
  Buildings: require('../../db/queries/buildings'),
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

module.exports = router;
