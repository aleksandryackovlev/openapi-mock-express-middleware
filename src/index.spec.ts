import path from 'path';

import { Router } from 'express';

import { createMockMiddleware } from './index';

describe('createMockMiddleware', () => {
  it('should return an instance of the express router', async () => {
    const middleware = createMockMiddleware({
      file: path.resolve(__dirname, '../test/fixtures/petstore.yaml'),
    });

    expect(Object.getPrototypeOf(middleware)).toBe(Router);
  });

  it('should throw an error if the given file does not exist', () => {
    try {
      createMockMiddleware({
        file: path.resolve(__dirname, '../test/fixtures/petstore_not_exist.yaml'),
      });
      throw new Error('exit');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        `OpenAPI spec not found at location: ${path.resolve(
          __dirname,
          '../test/fixtures/petstore_not_exist.yaml'
        )}`
      );
    }
  });
});
