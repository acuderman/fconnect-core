// @ts-ignore
import convert from 'joi-to-json';

import { OptionalSchemaMapJoiObject, ValidationRules } from '../validate'
import { Method } from '../router/interfaces'
import joi from 'joi'
import { inspect } from 'util'
import { ErrorData } from '../errors'

interface ApiDefinition {
  path: string,
  schema: ValidationRules,
  method: Method,
  response: OptionalSchemaMapJoiObject,
  responseCode: number,
  errors: ErrorData[],
}

function constructParameters (paramType: 'path' | 'query', params: OptionalSchemaMapJoiObject | undefined): Record<string, string>[] {
  if (params === undefined) {
    return []
  }
  const swagger = convert(params)
  const swaggerProperties = swagger.properties

  return Object.keys(swaggerProperties).map((param: string) => {

    return {
      'in': paramType,
      'name': param,
      'required': swagger.required.includes(param),
      'schema': swaggerProperties[param]
    }
  })
}

function constructErrorSchemas (errors: ErrorData[]) {
  const errorSchemas: Record<string, any> = {}

  errors.map((error: ErrorData) => {
    const errorSchema = constructErrorResponse(error)
    errorSchemas[error.status] = errorSchemas[error.status] === undefined
      ? {
        description: 'Error',
        content: {
          'application/json': {
            schema: {
              oneOf: [errorSchema, errorSchema]
            },
          }
        }
      }
      // TODO: push doesn't work properly
      : errorSchemas[error.status].content['application/json'].schema.oneOf.push(errorSchema)
  })

  return errorSchemas
}

function constructErrorResponse (error: ErrorData) {
  return {
    type: 'object',
    additionalProperties: false,
    'properties': {
      'status': {
        'type': 'integer',
        'format': 'int32',
        'example': error.status
      },
      'error_code': {
        'type': 'string',
        'example': error.err_code
      },
      'message': {
        'type': 'string',
        'example': error.message
      },
      'required': [
        'error_code',
        'message',
        'status'
      ]
    }
  }
}

function documentApi (apiDefinition: ApiDefinition) {
  return {
    'info': {
      'title': 'Service name',
      'version': '1.0.0',
      'description': 'API for service name',
      'contact': {
        'name': 'Me',
        'email': 'test@g.com',
        'url': ''
      }
    },
    'openapi': '3.0.0',
    paths: {
      [apiDefinition.path]: {
        [apiDefinition.method]: {
          parameters: [
            ...constructParameters('path', joi.object({
              asd: joi.string().required()
            })),
            ...constructParameters('query', apiDefinition.schema.query)
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: convert(apiDefinition.schema.body ?? joi.object({}), false)
              }
            }
          },
          responses: {
            [apiDefinition.responseCode]: {
              description: 'ok',
              'content': {
                'application/json': {
                  schema: convert(apiDefinition.response ?? joi.object({}), false)
                }
              }
            },
            ...constructErrorSchemas(apiDefinition.errors),
          }
        }
      },
    },
  }
}

export function build (apiDefinition: ApiDefinition): void {
  const swagger = documentApi(apiDefinition)

  console.log('dslfdmsfkdsm')
  console.log(inspect(swagger, {
    showHidden: false,
    depth: null
  }))
}
