import { Router } from '../setup/router';
import { registerController, verifyEmailController, loginController } from '../controllers/authentication/registration-controller';
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
    registerController,
    {
      body: {
        google_id_token: joi.string().required(),
        student_email: joi.string().email().required(),
      },
    },
    Method.post,
  )

  router.exposed(
    'register/verify/:tracking_id',
    1,
    verifyEmailController,
    {
      params: {
        tracking_id: joi.string().uuid().required(),
      },
    },
    Method.get,
  )

  router.exposed(
    'login',
    1,
    loginController,
    {
      body: {
        google_id_token: joi.string().required(),
      }
    },
    Method.post,
  )
}
