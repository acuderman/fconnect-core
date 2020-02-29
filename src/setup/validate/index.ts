import joi, { SchemaMap } from 'joi'
import { NextFunction, Request, Response } from 'express';
import { throwException } from '../../utils/error-handler';

export interface ValidationRules {
    params?: SchemaMap;
    body?: SchemaMap;
    query?: SchemaMap;
}

export function validateSchema (rules: ValidationRules): (req: Request, res: Response, next: NextFunction) => Promise<void | Response>  {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      await Promise.all(Object.keys(rules).map(async (reqParameter: string) => {
        const Reqschema: SchemaMap | undefined = rules[reqParameter as keyof ValidationRules];
        const schema = joi.object(Reqschema);
        await schema.validate(req[reqParameter as keyof ValidationRules])
      }));

      next();
    } catch (e) {
      return throwException('VALIDATION_ERROR', res, e.message);
    }
  }
}