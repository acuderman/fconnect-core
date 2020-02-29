import express from 'express'
import { initConfig } from './config/config';
import {initRoutes} from "./routes";

const app: express.Express = express()
const port: string | number = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Listening at http://localhost%s:%s', port)
})

initConfig();
initRoutes()

export {
  app
};