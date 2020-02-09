import jsf, { JSONSchema } from 'json-schema-faker';
import { OpenAPIV3 } from 'openapi-types';
import express from 'express';

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

  constructor({
    method,
    path,
    operation,
  }: {
    path: string;
    method: string;
    operation: OpenAPIV3.OperationObject;
  }) {
    const pathPattern = path.replace(/\{([^/}]+)\}/g, (p1: string, p2: string): string => `:${p2}`);

    this.method = method.toUpperCase();
    this.operation = operation;

    this.pathRegexp = pathToRegexp(pathPattern);
  }

  getResponseSchema(): JSONSchema | null {
    if (this.operation && this.operation.responses) {
      const { responses } = this.operation;
      if (
        responses['200'] &&
        !isReferenceObject(responses['200']) &&
        responses['200'].content &&
        responses['200'].content['application/json'] &&
        responses['200'].content['application/json'].schema
      ) {
        const response = responses['200'].content['application/json'];
        const { schema, example, examples } = response;

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

    return null;
  }

  // validateRequest() {
  // }

  // isRequestAuthorized(): boolean {
  //   return true;
  // }

  generateResponse(req: express.Request, res: express.Response): express.Response {
    const responseSchema = this.getResponseSchema();

    return res.json(responseSchema ? jsf.generate(responseSchema) : {});
  }
}

export default Operation;
