import { app } from '../../index';
import { Method } from './interfaces';
import { NextFunction, Request, Response } from 'express';
import { throwException } from '../errors';
import { validateSchema, ValidationRules } from '../validate';
import { verifyBearerToken } from '../jwt';
import { ExtendedProtectedRequest } from '../interfaces';

type MiddlwewareFunction = (req: Request, res: Response, next: NextFunction) => void
type ControllerFunction = (req: Request<any>, res: Response, next: NextFunction) => object | Promise<object>

export class Router {
  private returnResponseFromController (
    controller: ControllerFunction,
    method: Method
  ): (req: Request, res: Response, next: NextFunction) => Promise<Response> {
    return async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
      try {
        const controllerResponse: object | void = await controller(req, res, next);
        const responseCode: number = this.determineResponseCode(method);

        return res.status(responseCode).json(controllerResponse)
      } catch (e) {
        return throwException(e.message, res);
      }
    }
  }

  private determineResponseCode (method: Method): number {
    switch (method) {
    case Method.get:
      return 200;
    case Method.post:
      return 201;
    default:
      return 200
    }
  }

  public exposed (
    route: string,
    version: number,
    controller: ControllerFunction,
    schema: ValidationRules,
    method: Method,
    middleware?: MiddlwewareFunction,
  ): void {
    app[method](
      `/v${version}/${route}`,
      validateSchema(schema),
      middleware !== undefined ? middleware : (_req: Request, _res: Response, next: NextFunction): void => { next(); },
      this.returnResponseFromController(controller, method))
  }

  private protectedRouteMiddleware (req: Request, res: Response, next: NextFunction): Response | void {
    try {
      verifyBearerToken(req as ExtendedProtectedRequest<any, any, any>)

      next();
    } catch (e) {
      const message = 'ERR_INVALID_TOKEN';
      return throwException(message, res);
    }
  }

  public protected (
    route: string,
    version: number,
    controller: ControllerFunction,
    schema: ValidationRules,
    method: Method,
    middleware?: MiddlwewareFunction,
  ): void {
    app[method](
      `/v${version}/${route}`,
      validateSchema(schema), 
      this.protectedRouteMiddleware,
      middleware !== undefined ? middleware : (_req: Request, _res: Response, next: NextFunction): void => { next(); },
      this.returnResponseFromController(controller, method))
  }
}
