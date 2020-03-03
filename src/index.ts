import express from 'express'
import { initConfig } from './config';
import { initRoutes } from './routes';
import bodyParser from 'body-parser'

const app: express.Express = express()
const port: string | number = process.env.PORT || 3000

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Listening at http://localhost%s:%s', port)
});

app.use(bodyParser.json())

initConfig();
initRoutes();

export {
  app
};
