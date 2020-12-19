import { Router } from '../setup/router'
import {
  loginController,
  registerController,
  verifyEmailController,
} from '../controllers/authentication/registration-controller'

import joi from 'joi'
import { Method } from '../setup/router/interfaces'
import { API } from '../exposed-interfaces'
import { errorList } from '../setup/errors'
import * as schemaValidator from '../setup/validate'

export function initRoutes (): void {
  const router: Router = new Router();
  addRegistrationRoutes(router);
}

namespace Schemas {
  export const registerBodyValidation: joi.ObjectSchema = schemaValidator.required<API.V1.Register.POST.RequestBody>({
    google_id_token: joi.string().required(),
    student_email: joi.string().required(),
  })
  export const registerResponse: joi.ObjectSchema = schemaValidator.optional<API.V1.Register.POST.Response>({})

  export const verifyTrackingIdParams: joi.ObjectSchema = schemaValidator.required<API.V1.Register.GET.Verify.RequestParams> ({
    tracking_id: joi.string().required(),
  })

  export const loginBody: joi.ObjectSchema = schemaValidator.required<API.V1.Login.POST.RequestBody> ({
    google_id_token: joi.string().required(),
  })
  export const loginResponse: joi.ObjectSchema = schemaValidator.required<API.V1.Login.POST.Response> ({
    access_token: joi.string().required(),
  })
}

function addRegistrationRoutes(router: Router): void {

  router.exposed (
    {
      method: Method.post,
      response: Schemas.registerResponse,
      schema: {
        body: Schemas.registerBodyValidation,
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



  router.exposed(
    {
      method: Method.get,
      response: joi.string().required(),
      schema: {
        params: Schemas.verifyTrackingIdParams,
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

  router.exposed(
    {
      method: Method.post,
      response: Schemas.loginResponse,
      schema: {
        body: Schemas.loginBody,
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
