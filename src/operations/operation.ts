import { OpenAPIV3 } from 'openapi-types';
import express from 'express';
import { has, get, set, findKey } from 'lodash';

import { pathToRegexp } from 'path-to-regexp';

import { JSF, JSONSchema } from '../utils';

export interface ParamsSchemas {
  header: JSONSchema;
  query: JSONSchema;
  path: JSONSchema;
}

function isReferenceObject(response: unknown): response is OpenAPIV3.ReferenceObject {
  return typeof response === 'object' && response !== null && '$ref' in response;
}

export class Operation {
  method: string;

  pathRegexp: RegExp;

  operation: OpenAPIV3.OperationObject;

  pathPattern: string;

  generator: JSF;

  securitySchemes: { [key: string]: OpenAPIV3.SecuritySchemeObject } | null;

  parentParams: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] | null;

  constructor({
    method,
    path,
    operation,
    securitySchemes,
    generator,
    parentParams,
  }: {
    path: string;
    method: string;
    operation: OpenAPIV3.OperationObject;
    generator: JSF;
    securitySchemes?: { [key: string]: OpenAPIV3.SecuritySchemeObject };
    parentParams?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
  }) {
    this.pathPattern = path.replace(/\{([^/}]+)\}/g, (p1: string, p2: string): string => `:${p2}`);
    this.parentParams = parentParams || null;

    this.method = method.toUpperCase();
    this.operation = operation;
    this.securitySchemes = securitySchemes || null;
    this.generator = generator;

    this.pathRegexp = pathToRegexp(this.pathPattern);
  }

  getResponseStatus(): number {
    const responses = get(this.operation, 'responses');

    if (!responses) {
      return 200;
    }

    const status: string | undefined = findKey(responses, (content, code) => {
      const statusCode = parseInt(code, 10);

      if (Number.isNaN(statusCode)) {
        return false;
      }

      return statusCode >= 200 && statusCode < 299;
    });

    return status ? parseInt(status, 10) : 200;
  }

  getResponseSchema(responseStatus = 200): JSONSchema | null {
    if (
      has(this.operation, ['responses', responseStatus, 'content', 'application/json', 'schema'])
    ) {
      const { schema, example, examples } = get(this.operation, [
        'responses',
        responseStatus,
        'content',
        'application/json',
      ]);

      if (schema && !isReferenceObject(schema)) {
        const resultSchema: JSONSchema = schema as JSONSchema;

        if (example) {
          resultSchema.example = example;
        }

        if (examples) {
          resultSchema.examples = examples;
        }

        return resultSchema;
      }

      return null;
    }

    return null;
  }

  getSecurityRequirements(): OpenAPIV3.SecurityRequirementObject[] {
    const requirements: OpenAPIV3.SecurityRequirementObject[] = this.operation.security || [];

    return requirements;
  }

  getParamsSchemas(): ParamsSchemas {
    const schemas: ParamsSchemas = {
      header: {
        type: 'object',
        required: [],
      },
      query: {
        type: 'object',
        additionalProperties: false,
        required: [],
      },
      path: {
        type: 'object',
        additionalProperties: false,
        required: [],
      },
    };

    let parameters: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] = [];

    if (this.parentParams) {
      parameters = [...this.parentParams];
    }

    const localParams = get(this.operation, ['parameters']);

    if (localParams) {
      parameters = [...parameters, ...localParams];
    }

    if (parameters) {
      parameters.forEach((parameter) => {
        if (
          parameter &&
          !isReferenceObject(parameter) &&
          (parameter.in === 'header' || parameter.in === 'query' || parameter.in === 'path') &&
          schemas[parameter.in]
        ) {
          const prevRequired: string[] = schemas[parameter.in].required || [];

          set(
            schemas,
            [
              parameter.in,
              'properties',
              parameter.in === 'header' ? parameter.name.toLowerCase() : parameter.name,
            ],
            parameter.schema
          );

          if (parameter.required) {
            set(
              schemas,
              [parameter.in, 'required'],
              [
                ...prevRequired,
                parameter.in === 'header' ? parameter.name.toLowerCase() : parameter.name,
              ]
            );
          }
        }
      });
    }

    return schemas;
  }

  getBodySchema(contentType: string): JSONSchema | null {
    return get(this.operation, ['requestBody', 'content', contentType, 'schema']);
  }

  generateResponse(req: express.Request, res: express.Response): express.Response {
    const responseStatus = this.getResponseStatus();
    const responseSchema = this.getResponseSchema(responseStatus);

    return res
      .status(responseStatus)
      .json(responseSchema ? this.generator.generate(responseSchema) : {});
  }
}

export const createOperation = ({
  method,
  path,
  operation,
  generator,
  securitySchemes,
  parentParams,
}: {
  path: string;
  method: string;
  operation: OpenAPIV3.OperationObject;
  generator: JSF;
  securitySchemes?: { [key: string]: OpenAPIV3.SecuritySchemeObject };
  parentParams?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
}): Operation =>
  new Operation({
    method,
    path,
    operation,
    generator,
    securitySchemes,
    parentParams,
  });
