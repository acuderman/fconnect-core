import joi, { Schema } from 'joi'

import { NextFunction, Request, Response } from 'express';
import { throwException } from '../errors';

type SchemaLikeWithoutArray = string | number | boolean | null | Schema;
type SchemaLike = SchemaLikeWithoutArray;

export type ValidationSchema <T> = joi.ObjectSchema<{
  [key in keyof T]: SchemaLike | SchemaLike[] | ValidationSchema<T[keyof T]>;
}>;

interface OptionalSchemaMap {
  [key: string]: SchemaLike | SchemaLike[] | undefined;
}
export type OptionalSchemaMapJoiObject = joi.ObjectSchema<OptionalSchemaMap> | joi.ArraySchema

export interface ValidationRules {
  params?: OptionalSchemaMapJoiObject;
  body?: OptionalSchemaMapJoiObject;
  query?: OptionalSchemaMapJoiObject;
}

export function validateSchema (rules: ValidationRules): (req: Request, res: Response, next: NextFunction) => Promise<void | Response>  {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      await Promise.all(Object.keys(rules).map(async (reqParameter: string) => {
        const parameterSchema: OptionalSchemaMapJoiObject | undefined = rules[reqParameter as keyof ValidationRules];

        if (parameterSchema !== undefined) {
          const validation: joi.ValidationResult = await parameterSchema.validate(req[reqParameter as keyof ValidationRules])

          if (validation.error !== undefined) {
            throw new Error(JSON.stringify(validation.error.message))
          }
        }
      }));

      next();
    } catch (e) {
      return throwException('VALIDATION_ERROR', res, e.message);
    }
  }
}
