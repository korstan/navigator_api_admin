const Router = require('@koa/router');

const BASE_PATH = '/api/pathPoints';
const router = new Router({ prefix: BASE_PATH });

const Query = {
  Buildings: require('../../db/queries/buildings'),
  Locations: require('../../db/queries/locations'),
  Points: require('../../db/queries/points'),
  PathPoints: require('../../db/queries/pathPoints'),
};

router.post('/new', async (ctx, next) => {
  try {
    if (ctx.request.body.buildingId && ctx.request.body.title && ctx.request.body.level && ctx.request.body.x && ctx.request.body.y) {
      const { buildingId, title, level, x, y, textToSpeech, isStairs } = ctx.request.body;
      const [newPoint] = await Query.PathPoints.create({
        buildingId,
        title,
        level,
        x,
        y,
        textToSpeech,
        isStairs,
      });
      ctx.status = 200;
      ctx.body = {
        level: newPoint.level,
        point: {
          id: newPoint.id,
          title: newPoint.title,
          x: newPoint.x,
          y: newPoint.y,
          textToSpeech: newPoint.textToSpeech,
          isStairs: newPoint.isStairs,
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
    const [pathPoint] = await Query.PathPoints.update(id,{ 
      title: reqBody.title, 
      level: reqBody.level, 
      x: reqBody.x, 
      y: reqBody.y,
      textToSpeech: reqBody.textToSpeech,
      isStairs: reqBody.isStairs
    });
    
    await Query.PathPoints.removeAllPointLinks(id);
    for(let link of ctx.request.body.links) {
      console.log(link)
      await Query.PathPoints.makeLink(id, link);
    }
    ctx.body = { 
      id,
      level: pathPoint.level,
      title: pathPoint.title,
      x: pathPoint.x,
      y: pathPoint.y,
      textToSpeech: pathPoint.textToSpeech,
      isStairs: pathPoint.isStairs,
    };
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    ctx.body = { error: { message: 'Internal Server Error' } };
    ctx.status = 500;
  }
  await next();
});

router.delete('/:id/remove', async (ctx, next) => {
  try {
    const id = ctx.params.id;
    await Query.Locations.removePathPointIdReferences(id);
    await Query.PathPoints.removeById(id);
    ctx.body = { id };
    ctx.status = 200;
  } catch (error) {
    ctx.body = { error: { message: 'Internal Server Error' } };
    ctx.status = 500;
  }
  await next();
});

module.exports = router;
