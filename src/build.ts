import { initRoutes } from './routes'
import * as swagger from './setup/swagger/generate'

// eslint-disable-next-line no-console
console.log('Building swagger')
swagger.addApiHeader({
  openapi: '3.0.0',
  info: {
    title: 'Fconnect core service',
    version: '1.0.0',
    description: 'API for Fconnect core service',
    contact: {
      name: 'Fconnect Team',
      email: 'info@fconnect.com',
      url: 'http:localhost:3000',
    }
  },
  tags: [{
    name: 'Protected',
  }, {
    name: 'Exposed',
  }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {}
})
initRoutes()
swagger.writeSwagger('./swagger')
