// @ts-ignore
import convert from 'joi-to-json';

import { OptionalSchemaMapJoiObject, ValidationRules } from '../validate'
import { Method } from '../router/interfaces'
import joi from 'joi'
import { inspect } from 'util'

// let swaggerDefinitions = {}
//
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

function documentApi (path: string, schema: ValidationRules, method: Method) {
  const path1 = path + 'aasd/:asd'
  return {
    'info': {
      'title': 'Service name',
      'version': '1.0.0',
      'description': 'API for service name',
      'contact': {
        'name': 'Me',
        'email': 'Me',
        'url': ''
      }
    },
    'openapi': '3.0.0',
    paths: {
      [path1]: {
        [method]: {
          parameters: [
            ...constructParameters('path', joi.object({
              asd: joi.string().required()
            })),
            ...constructParameters('query', schema.query)
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: convert(schema.body ?? joi.object({}), false)
              }
            }
          },
          responses: {
            '200': {
              description: 'ok',
              'content': {
                'application/json': {
                  schema: convert(joi.object({}), false)
                }
              }
            }
          }
        }
      },
    },
  }
}

export function build (path: string, schema: ValidationRules, method: Method): void {
  // Object.keys(schema).map((param: string) => {
  //   const rules: OptionalSchemaMapJoiObject | undefined = schema[param as keyof ValidationRules]
  //
  //   if (rules !== undefined) {
  //     const swagger = convert(rules, true);
  //     console.log(swagger, path, method)
  //   }
  // })
  const swagger = documentApi(path, schema, method)
  console.log('dslfdmsfkdsm')
  console.log(inspect(swagger, {
    showHidden: false,
    depth: null
  }))
}
