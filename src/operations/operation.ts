import jsf, { JSONSchema } from 'json-schema-faker';
import { OpenAPIV3 } from 'openapi-types';
import express from 'express';
import { has, get, set } from 'lodash';

import faker from 'faker';
import { pathToRegexp } from 'path-to-regexp';

jsf.extend('faker', () => {
  // faker.locale = locale;
  return faker;
});

jsf.define('example', (value) => {
  return value;
});

jsf.define('examples', (value) => {
  if (typeof value === 'object' && value !== null && Object.keys(value).length) {
    return value[Object.keys(value)[0]].value;
  }

  return '';
});

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

  securitySchemes: { [key: string]: OpenAPIV3.SecuritySchemeObject } | null;

  constructor({
    method,
    path,
    operation,
    securitySchemes,
  }: {
    path: string;
    method: string;
    operation: OpenAPIV3.OperationObject;
    securitySchemes?: { [key: string]: OpenAPIV3.SecuritySchemeObject };
  }) {
    this.pathPattern = path.replace(/\{([^/}]+)\}/g, (p1: string, p2: string): string => `:${p2}`);

    this.method = method.toUpperCase();
    this.operation = operation;
    this.securitySchemes = securitySchemes || null;

    this.pathRegexp = pathToRegexp(this.pathPattern);
  }

  getResponseSchema(): JSONSchema | null {
    if (has(this.operation, ['responses', '200', 'content', 'application/json', 'schema'])) {
      const { schema, example, examples } = get(this.operation, [
        'responses',
        '200',
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

    const parameters = get(this.operation, ['parameters']);

    if (parameters) {
      parameters.forEach((parameter) => {
        if (
          parameter &&
          !isReferenceObject(parameter) &&
          (parameter.in === 'header' || parameter.in === 'query' || parameter.in === 'path') &&
          schemas[parameter.in]
        ) {
          const prevRequired: string[] = schemas[parameter.in].required || [];

          set(schemas, [parameter.in, 'properties', parameter.name], parameter.schema);
          set(schemas, [parameter.in, 'required'], [...prevRequired, parameter.name]);
        }
      });
    }

    return schemas;
  }

  getBodySchema(contentType: string): JSONSchema | null {
    return get(this.operation, ['requestBody', 'content', contentType, 'schema']);
  }

  generateResponse(req: express.Request, res: express.Response): express.Response {
    const responseSchema = this.getResponseSchema();

    return res.json(responseSchema ? jsf.generate(responseSchema) : {});
  }
}

export const createOperation = ({
  method,
  path,
  operation,
  securitySchemes,
}: {
  path: string;
  method: string;
  operation: OpenAPIV3.OperationObject;
  securitySchemes?: { [key: string]: OpenAPIV3.SecuritySchemeObject };
}): Operation =>
  new Operation({
    method,
    path,
    operation,
    securitySchemes,
  });
