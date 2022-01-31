import { OpenAPIV3 } from 'openapi-types';

import { Operation } from './operation';
import { createGenerator } from '../utils';

const generator = createGenerator();

describe('Operation', () => {
  describe('getResponseStatus', () => {
    it('should return the first lowest successful status code', () => {
      const operation = new Operation({
        method: 'get',
        path: '/pet/:petId',
        generator,
        operation: {
          responses: {
            '205': {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'photo'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      photo: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '201': {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'photo'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      photo: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(operation.getResponseStatus()).toBe(201);
    });

    it('should return 200 if successful responses are not described', () => {
      const operation = new Operation({
        method: 'get',
        generator,
        path: '/pet/:petId',
        operation: {} as OpenAPIV3.OperationObject,
      });

      expect(operation.getResponseStatus()).toBe(200);
    });

    it('should return 200 if responses are strings', () => {
      const operation = new Operation({
        method: 'get',
        generator,
        path: '/pet/:petId',
        operation: {
          responses: {
            default: {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'photo'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      photo: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(operation.getResponseStatus()).toBe(200);
    });
  });

  describe('getResponseSchema', () => {
    it('should return the application/json response schema for a given status code', () => {
      const operation = new Operation({
        method: 'get',
        path: '/pet/:petId',
        generator,
        operation: {
          responses: {
            '205': {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'photo'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      photo: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            '201': {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['nameValue'],
                    properties: {
                      nameValue: {
                        type: 'string',
                      },
                      photoValue: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(operation.getResponseSchema(205)).toStrictEqual({
        type: 'object',
        required: ['name', 'photo'],
        properties: {
          name: {
            type: 'string',
          },
          photo: {
            type: 'string',
          },
        },
      });
    });

    it('should extend the resulting schema with the example prop if it exists on its parent', () => {
      const operation = new Operation({
        method: 'get',
        path: '/pet/:petId',
        generator,
        operation: {
          responses: {
            '200': {
              description: 'successful operation',
              content: {
                'application/json': {
                  example: {
                    name: 'first example name',
                    photo: 'http://some-url-first.com',
                  },
                  schema: {
                    type: 'object',
                    required: ['name', 'photo'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      photo: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(operation.getResponseSchema()).toStrictEqual({
        type: 'object',
        required: ['name', 'photo'],
        properties: {
          name: {
            type: 'string',
          },
          photo: {
            type: 'string',
          },
        },
        example: {
          name: 'first example name',
          photo: 'http://some-url-first.com',
        },
      });
    });

    it('should extend the resulting schema with the examples prop if it exists on its parent', () => {
      const operation = new Operation({
        method: 'get',
        path: '/pet/:petId',
        generator,
        operation: {
          responses: {
            '205': {
              description: 'successful operation',
              content: {
                'application/json': {
                  examples: {
                    first: {
                      value: {
                        name: 'first example name',
                        photo: 'http://some-url-first.com',
                      },
                    },
                    second: {
                      value: {
                        name: 'second example name',
                        photo: 'http://some-url-second.com',
                      },
                    },
                  },
                  schema: {
                    type: 'object',
                    required: ['name', 'photo'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      photo: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(operation.getResponseSchema(205)).toStrictEqual({
        type: 'object',
        required: ['name', 'photo'],
        properties: {
          name: {
            type: 'string',
          },
          photo: {
            type: 'string',
          },
        },
        examples: {
          first: {
            value: {
              name: 'first example name',
              photo: 'http://some-url-first.com',
            },
          },
          second: {
            value: {
              name: 'second example name',
              photo: 'http://some-url-second.com',
            },
          },
        },
      });
    });

    it('should return null if the resulting schema is a reference', () => {
      const operation = new Operation({
        method: 'get',
        path: '/pet/:petId',
        generator,
        operation: {
          responses: {
            '200': {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Pet',
                  },
                },
              },
            },
          },
        },
      });

      expect(operation.getResponseSchema()).toBe(null);
    });

    it('should return null if schema does not exist', () => {
      const operation = new Operation({
        method: 'get',
        path: '/pet/:petId',
        generator,
        operation: {
          responses: {
            '400': {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'photo'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      photo: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(operation.getResponseSchema()).toBe(null);
    });
  });

  describe('getParamsSchemas', () => {
    it('should return schemas for header, query and path', () => {
      const operationWithParams = new Operation({
        method: 'post',
        path: '/pet/:petId',
        generator,
        operation: {
          parameters: [
            {
              name: 'petId',
              in: 'path',
              description: 'ID of pet to update',
              required: true,
              schema: {
                type: 'integer',
              },
            },
            {
              name: 'api-key',
              in: 'header',
              description: 'api key',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'limit',
              schema: {
                type: 'integer',
              },
            },
          ],
          responses: {},
        },
      });

      const operationWithoutParams = new Operation({
        method: 'post',
        path: '/pet/:petId',
        generator,
        operation: {} as OpenAPIV3.OperationObject,
      });

      expect(operationWithParams.getParamsSchemas()).toStrictEqual({
        header: {
          type: 'object',
          required: ['api-key'],
          properties: {
            'api-key': {
              type: 'string',
            },
          },
        },
        query: {
          type: 'object',
          additionalProperties: false,
          required: [],
          properties: {
            limit: {
              type: 'integer',
            },
          },
        },
        path: {
          type: 'object',
          additionalProperties: false,
          required: ['petId'],
          properties: {
            petId: {
              type: 'integer',
            },
          },
        },
      });

      expect(operationWithoutParams.getParamsSchemas()).toStrictEqual({
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
      });
    });

    it("should convert header params' names to lower case", () => {
      const operationWithParams = new Operation({
        method: 'post',
        path: '/pet/:petId',
        generator,
        operation: {
          parameters: [
            {
              name: 'X-Api-Key',
              in: 'header',
              description: 'api key',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {},
        },
      });

      expect(operationWithParams.getParamsSchemas()).toStrictEqual({
        header: {
          type: 'object',
          required: ['x-api-key'],
          properties: {
            'x-api-key': {
              type: 'string',
            },
          },
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
      });
    });
  });

  describe('getBodySchema', () => {
    it('should return the schema for the request body', () => {
      const operation = new Operation({
        method: 'post',
        path: '/pet/:petId',
        generator,
        operation: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'photo'],
                  properties: {
                    name: {
                      type: 'string',
                    },
                    photo: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {},
        } as OpenAPIV3.OperationObject,
      });

      expect(operation.getBodySchema('application/json')).toStrictEqual({
        type: 'object',
        required: ['name', 'photo'],
        properties: {
          name: {
            type: 'string',
          },
          photo: {
            type: 'string',
          },
        },
      });

      expect(operation.getBodySchema('multipart/form-data')).toBe(undefined);
    });
  });
});
