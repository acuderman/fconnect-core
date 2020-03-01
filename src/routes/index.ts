import { Router } from '../setup/router';
import { swapAccessToken, register, verifyEmail } from '../controllers/authentication/registration-controller';
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
        google_id_token: joi.string().required(),
        student_email: joi.string().email().required(),
      },
    },
    Method.post,
  )

  router.exposed(
    'register/verify/:tracking_id',
    1,
    verifyEmail,
    {
      params: {
        tracking_id: joi.string().uuid().required(),
      },
    },
    Method.get,
  )

  // protected
  router.exposed(
    'auth/swap-token',
    1,
    swapAccessToken,
    {},
    Method.get,
  )
}
