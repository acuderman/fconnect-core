import { initConfig } from './config';
import './routes';
import { initRoutes } from './routes'
import { Router } from './setup/router'

initConfig().then(() => {
  initRoutes()

  const port: number = <number | undefined> process.env.PORT || 3000
  Router.app.listen(port, () => {
    console.log('Listening to port', port)
  })
});

