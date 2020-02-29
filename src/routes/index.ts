import { Router } from '../setup/router';
import { register } from '../controllers/registration';
import joi from 'joi'
import { Method } from '../setup/router/interfaces';

export function initRoutes (): void {
  const router: Router = new Router();
  addRegistrationRoutes(router);
}

function addRegistrationRoutes(router: Router): void {
  router.exposed(
    'register',
    1,
    register,
    {
      body: {
        google_email: joi.string().email().required(),
        famnit_email: joi.string().email().required(),
      },
    },
    Method.post,
  )
}
