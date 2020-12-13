import joi, { SchemaLike } from 'joi'

import { NextFunction, Request, Response } from 'express';
import { throwException } from '../errors';

export type ValidationSchema <T> = joi.ObjectSchema<{
  // TODO: change with schemalike without object , undefined
  [key in keyof T]: SchemaLike | SchemaLike[] | ValidationSchema<T[keyof T]>;
}>;

interface OptionalSchemaMap {
  [key: string]: SchemaLike | SchemaLike[] | undefined;
}

export interface ValidationRules {
  params?: joi.ObjectSchema<OptionalSchemaMap>;
  body?: joi.ObjectSchema<OptionalSchemaMap>;
  query?: joi.ObjectSchema<OptionalSchemaMap>;
}

export function validateSchema (rules: ValidationRules): (req: Request, res: Response, next: NextFunction) => Promise<void | Response>  {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      await Promise.all(Object.keys(rules).map(async (reqParameter: string) => {
        const reqSchema: joi.ObjectSchema<OptionalSchemaMap> | undefined = rules[reqParameter as keyof ValidationRules];

        if (reqSchema !== undefined) {
          const validation: joi.ValidationResult = await reqSchema.validate(req[reqParameter as keyof ValidationRules])

          if (validation.error !== undefined) {
            throw new Error(JSON.stringify(validation.error))
          }
        }
      }));

      next();
    } catch (e) {
      return throwException('VALIDATION_ERROR', res, e.message);
    }
  }
}
