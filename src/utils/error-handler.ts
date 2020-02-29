import { Response } from 'express';

interface ErrorList {
  [key: string]: ErrorData;
}

interface ErrorData {
  status: number;
  err_code: string;
  message: string;
}

export const errorList: ErrorList = {
  'VALIDATION_ERROR': {
    status: 400,
    err_code: 'VALIDATION_ERROR',
    message: 'Invalid data',
  }
};

export function throwException (err_name: string, res?: Response, message?: string): Response {
  const err: ErrorData = errorList[err_name];

  if (res !== undefined) {
    return res.status(err.status).json({
      message: message !== undefined ? message : err.message,
      err_code: err.err_code,
    })
  }

  throw new Error(err_name);
}