import { Router } from '../setup/router';
import { registerController, verifyEmailController, loginController } from '../controllers/authentication/registration-controller';
import joi from 'joi'
import { Method } from '../setup/router/interfaces';
import { API } from '../exposed-interfaces'
import { ValidationSchema } from '../setup/validate'

export function initRoutes (): void {
  const router: Router = new Router();
  addRegistrationRoutes(router);
}

function addRegistrationRoutes(router: Router): void {
  const registerBodyValidation = {
    google_id_token: joi.string(),
    student_email: joi.string().email().required(),
  }

  type Map<T> =
    T extends joi.StringSchema ? string :
      T extends joi.NumberSchema ? number :
        T extends joi.BooleanSchema ? boolean :
          any;

  type MapObject<T> = {
    [K in keyof T]: Map<T[K]>
  }

  type dsfds = Map<typeof registerBodyValidation.google_id_token>

  type Type = MapObject<typeof registerBodyValidation>
  // TODO: https://github.com/TCMiranda/joi-extract-type

  router.exposed (
    'register',
    1,
    registerController,
    {
      body: registerBodyValidation,
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
