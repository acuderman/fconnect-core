import { Router } from '../setup/router'
// import { registerController, verifyEmailController, loginController } from '../controllers/authentication/registration-controller';
import { registerController } from '../controllers/authentication/registration-controller'

import joi from 'joi'
import { Method } from '../setup/router/interfaces'
import { API } from '../exposed-interfaces'
import { ValidationSchema } from '../setup/validate'
import { errorList } from '../setup/errors'

export function initRoutes (): void {
  const router: Router = new Router();
  addRegistrationRoutes(router);
}

function addRegistrationRoutes(router: Router): void {
  const registerBodyValidation: ValidationSchema<API.V1.Register.POST.RequestBody> = joi.object({
    google_id_token: joi.string().required(),
    student_email: joi.string().email().required(),
  }).required()

  router.exposed (
    {
      method: Method.post,
      response: joi.object({}),
      schema: {
        body: registerBodyValidation,
      },
      response_description: 'void',
      description: 'Register new account',
      errors: [errorList['ERR_NOT_FAMNIT_EMAIL'], errorList['ERR_USER_WITH_THAT_EMAIL_ALREADY_EXISTS'], errorList['ERR_UNABLE_TO_DECODE_GOOGLE_ID_TOKEN']],
      response_code: 204
    },
    'register',
    1,
    registerController,
  )

  router.protected (
    {
      method: Method.post,
      response: joi.object({}),
      schema: {
        body: registerBodyValidation,
      },
      response_description: 'void',
      description: 'Register new account',
      errors: [errorList['ERR_NOT_FAMNIT_EMAIL'], errorList['ERR_USER_WITH_THAT_EMAIL_ALREADY_EXISTS'], errorList['ERR_UNABLE_TO_DECODE_GOOGLE_ID_TOKEN']],
      response_code: 204
    },
    'exposed_test',
    1,
    registerController,
  )


  // router.exposed(
  //   'register/verify/:tracking_id',
  //   1,
  //   verifyEmailController,
  //   {
  //     params: {
  //       tracking_id: joi.string().uuid().required(),
  //     },
  //   },
  //   Method.get,
  // )
  //
  // router.exposed(
  //   'login',
  //   1,
  //   loginController,
  //   {
  //     body: {
  //       google_id_token: joi.string().required(),
  //     }
  //   },
  //   Method.post,
  // )
}
