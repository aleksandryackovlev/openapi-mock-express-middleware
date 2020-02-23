import { Operation } from './operation';

describe('operation', () => {
  describe('getResponseStatus', () => {
    it('should return the first lowest successful status code', () => {
      const operation = new Operation({
        method: 'get',
        path: '/pet/:petId',
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
        path: '/pet/:petId',
        operation: {},
      });

      expect(operation.getResponseStatus()).toBe(200);
    });

    it('should return 200 if responses are strings', () => {
      const operation = new Operation({
        method: 'get',
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
      expect(true).toBe(false);
    });

    it('should extend the resulting schema with the example prop if it exists on its parent', () => {
      expect(true).toBe(false);
    });

    it('should extend the resulting schema with the examples prop if it exists on its parent', () => {
      expect(true).toBe(false);
    });

    it('should return null if the resulting schema is a reference', () => {
      expect(true).toBe(false);
    });

    it('should return null if schema does not exist', () => {
      expect(true).toBe(false);
    });
  });

  describe('getParamsSchemas', () => {
    it('should return schemas for header, query and path', () => {
      const operationWithParams = new Operation({
        method: 'post',
        path: '/pet/:petId',
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
        },
      });

      const operationWithoutParams = new Operation({
        method: 'post',
        path: '/pet/:petId',
        operation: {},
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
  });

  describe('getBodySchema', () => {
    it('should return the schema for the request body', () => {
      const operation = new Operation({
        method: 'post',
        path: '/pet/:petId',
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
        },
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
