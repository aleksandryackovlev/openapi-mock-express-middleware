import jsf, { JSONSchema } from 'json-schema-faker';
import { OpenAPIV3 } from 'openapi-types';
import express from 'express';
import { has, get } from 'lodash';

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

function isReferenceObject(response: unknown): response is OpenAPIV3.ReferenceObject {
  return typeof response === 'object' && response !== null && '$ref' in response;
}

class Operation {
  method: string;

  pathRegexp: RegExp;

  operation: OpenAPIV3.OperationObject;

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
    const pathPattern = path.replace(/\{([^/}]+)\}/g, (p1: string, p2: string): string => `:${p2}`);

    this.method = method.toUpperCase();
    this.operation = operation;
    this.securitySchemes = securitySchemes || null;

    this.pathRegexp = pathToRegexp(pathPattern);
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

  isRequestAuthorized(req: express.Request): boolean {
    const securityRequirements = this.getSecurityRequirements();
    if (
      securityRequirements.some((schemes) => {
        if (schemes && this.securitySchemes) {
          return Object.keys(schemes).some((scheme) => {
            if (this.securitySchemes && this.securitySchemes[scheme]) {
              const securityScheme = this.securitySchemes[scheme];
              switch (securityScheme.type) {
                case 'apiKey':
                  if (securityScheme.in === 'header') {
                    return req.header(securityScheme.name) === undefined;
                  }

                  if (securityScheme.in === 'query') {
                    return req.query[securityScheme.name] === undefined;
                  }

                  if (securityScheme.in === 'cookie') {
                    return req.cookies[securityScheme.name] === undefined;
                  }

                  return false;

                case 'http': {
                  const authHeader = req.header('Authorization');
                  if (!authHeader) {
                    return true;
                  }

                  return securityScheme.scheme === 'basic'
                    ? !authHeader.startsWith('Basic')
                    : !authHeader.startsWith('Bearer');
                }

                case 'oauth2': {
                  const authHeader = req.header('Authorization');
                  if (!authHeader) {
                    return true;
                  }

                  return !authHeader.startsWith('Bearer');
                }

                default:
                  return false;
              }
            }

            return false;
          });
        }

        return false;
      })
    ) {
      return false;
    }

    return true;
  }

  generateResponse(req: express.Request, res: express.Response): express.Response {
    const responseSchema = this.getResponseSchema();

    if (!this.isRequestAuthorized(req)) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    return res.json(responseSchema ? jsf.generate(responseSchema) : {});
  }
}

export default Operation;
