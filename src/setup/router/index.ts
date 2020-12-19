import express, { NextFunction, Request, Response } from 'express'
import { throwException } from '../errors'
import { validateSchema } from '../validate'
import { verifyBearerToken } from '../jwt'
import { ExtendedProtectedRequest } from '../interfaces'
import * as swagger from '../swagger/generate'
import { ApiDefinition, ApiProtection } from '../swagger/generate'
import bodyParser from 'body-parser'

type MiddlwewareFunction = (req: Request, res: Response, next: NextFunction) => void
type ControllerFunction = (req: Request<any>, res: Response, next: NextFunction) => Record<string, any> | Promise<Record<string, any>>

export class Router {
  public static app: express.Express = express()

  constructor() {
    Router.app.use(bodyParser.json())
  }

  private returnResponseFromController (
    controller: ControllerFunction,
    responseCode: number,
  ): (req: Request, res: Response, next: NextFunction) => Promise<Response> {
    return async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
      try {
        const controllerResponse: Record<string, any> | void = await controller(req, res, next);

        return res.status(responseCode).json(controllerResponse)
      } catch (e) {
        return throwException(e.message, res);
      }
    }
  }

  public exposed (
    apiDefinition: Omit<ApiDefinition, 'path' | 'version' | 'protection'>,
    route: string,
    version: number,
    controller: ControllerFunction,
    middlewares: MiddlwewareFunction[],
  ): void {
    const path: string = `/v${version}/${route}`
    swagger.build({
      ...apiDefinition,
      protection: ApiProtection.exposed,
      path,
    })

    Router.app[apiDefinition.method](
      path,
      validateSchema(apiDefinition.schema),
      ...middlewares,
      this.returnResponseFromController(controller, apiDefinition.response_code))
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
    apiDefinition: Omit<ApiDefinition, 'path' | 'version' | 'protection' >,
    route: string,
    version: number,
    controller: ControllerFunction,
    middlewares: MiddlwewareFunction[],
  ): void {
    const path: string = `/v${version}/${route}`
    swagger.build({
      ...apiDefinition,
      protection: ApiProtection.token_protected,
      path,
    })

    Router.app[apiDefinition.method](
      `/v${version}/${route}`,
      validateSchema(apiDefinition.schema),
      this.protectedRouteMiddleware,
      ...middlewares,
      this.returnResponseFromController(controller, apiDefinition.response_code))
  }
}
