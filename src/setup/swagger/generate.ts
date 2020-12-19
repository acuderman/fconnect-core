// @ts-ignore
import convert from 'joi-to-json';
// @ts-ignore
import YAML from 'json-to-pretty-yaml'

import { OptionalSchemaMapJoiObject, ValidationRules } from '../validate'
import { Method } from '../router/interfaces'
import { ErrorData } from '../errors'


import joi from 'joi'
import * as fs from 'fs'

export enum ApiProtection {
  exposed = 'exposed',
  token_protected = 'token_protected'
}

export interface ApiDefinition {
  protection: ApiProtection,
  path: string,
  schema: ValidationRules,
  method: Method,
  description: string,
  response: OptionalSchemaMapJoiObject,
  response_description: string,
  response_code: number,
  errors: ErrorData[],
}

let api: Record<string, any> = {
  paths: {}
}

function constructParameters (paramType: 'path' | 'query', params: OptionalSchemaMapJoiObject | undefined): Record<string, string>[] {
  if (params === undefined) {
    return []
  }
  const swagger = convert(params, false)
  const swaggerProperties = swagger.properties

  return Object.keys(swaggerProperties).map((param: string) => {

    return {
      in: paramType,
      name: param,
      required: swagger.required.includes(param),
      schema: swaggerProperties[param]
    }
  })
}

function constructErrorSchemas (errors: ErrorData[]) {
  const errorSchemas: Record<string, any> = {}

  errors.forEach((error: ErrorData) => {
    const errorSchema = constructErrorResponse(error)
    if (errorSchemas[error.status] === undefined) {
      errorSchemas[error.status] = {
        description: 'Error',
        content: {
          'application/json': {
            schema: {
              oneOf: [errorSchema]
            },
          }
        }
      }
    } else {
      errorSchemas[error.status].content['application/json'].schema.oneOf.push(errorSchema)
    }
  })

  return errorSchemas
}

function constructErrorResponse (error: ErrorData) {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      status: {
        type: 'integer',
        format: 'int32',
        example: error.status
      },
      error_code: {
        type: 'string',
        example: error.err_code
      },
      message: {
        type: 'string',
        example: error.message
      },
      request_id: {
        type: 'string',
        example: 'd51b265e-5123-428d-8636-cb2df3d52067'
      },
      trace_id: {
        type: 'string',
        example: 'd51b265e-5123-428d-8636-cb2df3d52067'
      },
    },
    required: [
      'error_code',
      'message',
      'status'
    ]
  }
}

function documentApi (apiDefinition: ApiDefinition) {
  const protection = apiDefinition.protection === ApiProtection.token_protected ? {
    security: [{ 'bearerAuth': [] }],
    tags: ['Protected'],
  } : {
    tags: ['Exposed'],
  }

  const requestBody = apiDefinition.schema.body !== undefined ? {
    requestBody: {
      content: {
        'application/json': {
          schema: convert(apiDefinition.schema.body ?? joi.object({}), false)
        }
      }
    }
  } : {}

  api.paths[apiDefinition.path] = {
    [apiDefinition.method]: {
      ...protection,
      description: apiDefinition.description,
      parameters: [
        ...constructParameters('path', apiDefinition.schema.params),
        ...constructParameters('query', apiDefinition.schema.query)
      ],
      ...requestBody,
      responses: {
        [apiDefinition.response_code]: {
          description: apiDefinition.response_description,
          content: {
            'application/json': {
              schema: convert(apiDefinition.response ?? joi.object({}), false)
            }
          }
        },
        ...constructErrorSchemas(apiDefinition.errors),
      }
    }
  }
}

export function build (apiDefinition: ApiDefinition): void {
  documentApi(apiDefinition)
}

export function writeSwagger (path: string): void {
  fs.writeFileSync(`${path}.json`, JSON.stringify(api))

  const yaml = YAML.stringify(api)
  fs.writeFileSync(`${path}.yaml`, yaml)
}

export function addApiHeader(apiHeader: Record<string, any>) {
  api = apiHeader
}
