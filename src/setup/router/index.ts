import { app } from '../../index';
import { Method } from './interfaces';
import validate from 'express-validation';
import { NextFunction, Request, Response } from 'express';

type MiddlwewareFunction = (req: Request, res: Response, next: NextFunction) => void
type ControllerFunction = (req: Request, res: Response, next: NextFunction) => object

export class Router {
  private async returnResponseFromController (
    req: Request,
    res: Response,
    next: NextFunction,
    controller: ControllerFunction,
    method: Method
  ): Promise<Response> {

    try {
      const controllerResponse: object = await controller(req, res, next);
      const responseCode: number = this.determineResponseCode(method);

      return res.status(responseCode).json(controllerResponse)
    } catch (e) {

      return res.status(e.status).json({
        message: e.message,
        err_code: e.code,
      })
    }

  }

  private determineResponseCode (method: Method): number {
    switch (method) {
    case Method.get:
      return 200
    case Method.post:
      return 201
    default:
      return 200
    }
  }

  public exposed (
    route: string,
    version: string,
    controller: ControllerFunction,
    schema: object,
    method: Method,
    middleware?: MiddlwewareFunction,
  ): void {
    app[method](
      `/${version}/${route}`,
      validate(schema),
      middleware ? middleware : (_req, _res, next) => {
        next()
      },
      (req, res, next) => this.returnResponseFromController(req, res,next, controller, method))
  }
}
