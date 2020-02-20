import jsf, { JSONSchema } from 'json-schema-faker';
import { OpenAPIV3 } from 'openapi-types';
import express from 'express';
import Ajv from 'ajv';
import { has, get, set } from 'lodash';

import faker from 'faker';
import { pathToRegexp, match } from 'path-to-regexp';

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

const ajv = new Ajv({ coerceTypes: true, unknownFormats: ['int32', 'int64', 'binary'] });

function isReferenceObject(response: unknown): response is OpenAPIV3.ReferenceObject {
  return typeof response === 'object' && response !== null && '$ref' in response;
}

class Operation {
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

  isParamsValid(req: express.Request): boolean {
    const schemas: {
      header: JSONSchema;
      query: JSONSchema;
      path: JSONSchema;
    } = {
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

      if (schemas.header.properties && Object.keys(schemas.header.properties)) {
        const isHeadersValid = ajv.validate(schemas.header, req.headers);

        if (!isHeadersValid) {
          return false;
        }
      }

      if (
        (schemas.query.properties && Object.keys(schemas.query.properties)) ||
        (req.query && Object.keys(req.query))
      ) {
        const isQueryValid = ajv.validate(schemas.query, req.query);

        if (!isQueryValid) {
          return false;
        }
      }

      const matchPath = match(this.pathPattern);
      const matchObject = matchPath(req.path);

      if ((matchObject && matchObject.params) || schemas.path) {
        const isPathValid = ajv.validate(schemas.path, (matchObject && matchObject.params) || {});

        if (!isPathValid) {
          return false;
        }
      }

      return true;
    }

    return true;
  }

  isBodyValid(req: express.Request): boolean {
    if (has(this.operation, ['requestBody', 'content', 'application/json', 'schema'])) {
      const isBodyValid = ajv.validate(
        get(this.operation, ['requestBody', 'content', 'application/json', 'schema']),
        req.body
      );

      return !!isBodyValid;
    }

    return true;
  }

  isRequestValid(req: express.Request): boolean {
    return this.isParamsValid(req) && this.isBodyValid(req);
  }

  generateResponse(req: express.Request, res: express.Response): express.Response {
    const responseSchema = this.getResponseSchema();

    if (!this.isRequestValid(req)) {
      return res.status(400).json({ message: 'Bad request' });
    }

    return res.json(responseSchema ? jsf.generate(responseSchema) : {});
  }
}

export default Operation;
