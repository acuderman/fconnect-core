import { Response } from 'express';

export interface ErrorList {
  [key: string]: ErrorData;
}

export interface ErrorData {
  status: number;
  err_code: string;
  message: string;
  trace_id?: string;
  request_id?: string;
}

export const errorList: ErrorList = {
  'VALIDATION_ERROR': {
    status: 400,
    err_code: 'VALIDATION_ERROR',
    message: 'Invalid data.',
  },
  'ERR_UNABLE_TO_DECODE_GOOGLE_ID_TOKEN': {
    status: 400,
    err_code: 'ERR_UNABLE_TO_DECODE_GOOGLE_ID_TOKEN',
    message: 'Unable to decode google id token.',
  },
  'ERR_NOT_FAMNIT_EMAIL': {
    status: 400,
    err_code: 'ERR_NOT_FAMNIT_EMAIL',
    message: 'Email provided does not end with @student.upr.si .'
  },
  'ERR_USER_WITH_THAT_EMAIL_ALREADY_EXISTS': {
    status: 400,
    err_code: 'ERR_USER_WITH_THAT_EMAIL_ALREADY_EXISTS',
    message: 'Either Google or student email was already used for login.'
  },
  'ERR_UNABLE_TO_SEND_EMAIL': {
    status: 500,
    err_code: 'ERR_UNABLE_TO_SEND_EMAIL',
    message: 'There was a problem seding email.'
  },
  'ERR_INVALID_TOKEN': {
    status: 400,
    err_code: 'ERR_INVALID_TOKEN',
    message: 'Bearer token is invalid.'
  },
  'ERR_AUTHORIZATION_TOKEN_NOT_PROVIDED': {
    status: 400,
    err_code: 'ERR_AUTHORIZATION_TOKEN_NOT_PROVIDED',
    message: 'Bearer token not provided.'
  },
  'ERR_USER_DOES_NOT_EXIST': {
    status: 400,
    err_code: 'ERR_USER_DOES_NOT_EXIST',
    message: 'User not found.'
  },
  'ERR_USER_NOT_ACTIVATED': {
    status: 401,
    err_code: 'ERR_USER_NOT_ACTIVATED',
    message: 'You need to verify your student email.'
  }
};

export function throwException (err_name: string, res: Response, message?: string): Response {
  const err: ErrorData | undefined = errorList[err_name];

  if (res !== undefined && err !== undefined) {
    return res.status(err.status).json({
      message: message !== undefined ? message : err.message,
      err_code: err.err_code,
    })
  }

  return res.status(500).json({
    message: err_name,
    err_code: 'ERR_INTERNAL_ERROR',
  })
}
