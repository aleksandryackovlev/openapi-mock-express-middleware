import jsf, { JSFResult, JSONSchema } from 'json-schema-faker';
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

class Operation {
  method: string;

  pathRegexp: RegExp;

  operation: {
    responses?: object;
  };

  constructor({
    method,
    path,
    operation,
  }: {
    path: string;
    method: string;
    operation: {
      responses?: object;
    };
  }) {
    const pathPattern = path.replace(/\{([^/}]+)\}/g, (p1: string, p2: string): string => `:${p2}`);

    this.method = method.toUpperCase();
    this.operation = operation;

    this.pathRegexp = pathToRegexp(pathPattern);
  }

  getResponseSchema(): JSONSchema {
    if (this.operation && this.operation.responses) {
      if (
        this.operation.responses['200'] &&
        this.operation.responses['200'].content &&
        this.operation.responses['200'].content['application/json'] &&
        this.operation.responses['200'].content['application/json'].schema
      ) {
        const response = this.operation.responses['200'].content['application/json'];
        const { schema } = response;

        if (response.example) {
          schema.example = response.example;
        }

        if (response.examples) {
          schema.examples = response.examples;
        }

        return schema;
      }

      return {};
    }

    return {};
  }

  generateResponse(): JSFResult {
    const responseSchema = this.getResponseSchema();
    return responseSchema ? jsf.generate(responseSchema) : {};
  }
}

export default Operation;
