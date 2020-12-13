import joi, { SchemaLike, SchemaMap } from 'joi'
import { NextFunction, Request, Response } from 'express';
import { throwException } from '../errors';

export type ValidationSchema <T extends object> = {
  [key in keyof T]: SchemaLike | SchemaLike[];
};

interface OptionalSchemaMap {
  [key: string]: SchemaLike | SchemaLike[] | undefined;
}

export interface ValidationRules {
    params?: OptionalSchemaMap;
    body?: OptionalSchemaMap;
    query?: OptionalSchemaMap;
}

export function validateSchema (rules: ValidationRules): (req: Request, res: Response, next: NextFunction) => Promise<void | Response>  {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      await Promise.all(Object.keys(rules).map(async (reqParameter: string) => {
        const reqSchema: OptionalSchemaMap | undefined = rules[reqParameter as keyof ValidationRules];

        // TODO: validate if this cast works
        const schema = joi.object(reqSchema as SchemaMap);
        await schema.validate(req[reqParameter as keyof ValidationRules])
      }));

      next();
    } catch (e) {
      return throwException('VALIDATION_ERROR', res, e.message);
    }
  }
}
