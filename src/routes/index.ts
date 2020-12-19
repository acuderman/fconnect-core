import { Router } from '../setup/router'
// import { registerController, verifyEmailController, loginController } from '../controllers/authentication/registration-controller';
import {
  loginController,
  registerController,
  verifyEmailController,
} from '../controllers/authentication/registration-controller'

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
    [],
  )

  const verifyTrackingIdParams: ValidationSchema<API.V1.Register.GET.Verify.RequestParams> = joi.object({
    tracking_id: joi.string().required(),
  }).required()

  router.exposed(
    {
      method: Method.get,
      response: joi.string(),
      schema: {
        params: verifyTrackingIdParams,
      },
      response_description: 'Success message',
      description: 'Verify tracking id',
      errors: [],
      response_code: 200
    },
    'register/verify/:tracking_id',
    1,
    verifyEmailController,
    [],
  )

  const loginBody: ValidationSchema<API.V1.Login.POST.RequestBody> = joi.object({
    google_id_token: joi.string().required(),
  })
  const loginResponse: ValidationSchema<API.V1.Login.POST.Response> = joi.object({
    access_token: joi.string().required(),
  }).required()

  router.exposed(
    {
      method: Method.post,
      response: loginResponse,
      schema: {
        body: loginBody
      },
      response_description: 'Returns access token',
      description: 'User login',
      errors: [errorList['ERR_USER_DOES_NOT_EXIST'], errorList['ERR_USER_WITH_THAT_EMAIL_ALREADY_EXISTS']],
      response_code: 200,
    },
    'login',
    1,
    loginController,
    [],
  )
}
