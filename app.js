const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logger = require('koa-logger')
const Router = require('@koa/router');
const ApplicationRouter = require ('./src/api/router.js');
const config = require('./src/config');

const app = new Koa();
app.use(cors()).use(bodyParser());

const rootRouter = new Router();

rootRouter.get('/', async (ctx) => {
  ctx.body = 'Hello, World!\n';
});

app.use(rootRouter.routes());
ApplicationRouter(app);

app.use(logger());
// Слушаем порт, запускаем сервер
app.listen(config.PORT, () => {
  console.log(`Server running on port http://${config.HOST}:${config.PORT}`);
});
