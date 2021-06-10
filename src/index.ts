import fs from 'fs';

import express from 'express';
import type { OpenAPIV3 } from 'openapi-types';

import createRouter from './router';
import { createOperations } from './operations';
import {
  isAuthenticated,
  validateHeaders,
  validatePath,
  validateQuery,
  validateBody,
} from './middleware';
import { JSFOptions, JSFCallback } from './utils';

export interface MiddlewareOptions {
  file: string | OpenAPIV3.Document;
  inMemory: boolean;
  locale?: string;
  options?: Partial<JSFOptions>;
  jsfCallback?: JSFCallback;
}

export const createMockMiddleware = ({
  file,
  inMemory = false,
  locale = 'en',
  options = {},
  jsfCallback,
}: MiddlewareOptions): express.Router => {
  if (!inMemory && !fs.existsSync(file as string)) {
    throw new Error(`OpenAPI spec not found at location: ${file}`);
  } else if (inMemory && !file) {
    throw new Error(`OpenAPI spec not provided`);
  }

  const router = createRouter();
  const operations = createOperations({ file, inMemory, locale, options, callback: jsfCallback });

  router.use('/{0,}', async (req, res, next) => {
    res.locals.operation = await operations.match(req);
    next();
  });

  router.use(isAuthenticated, validateHeaders, validatePath, validateQuery, validateBody);

  router.use((req, res, next) => {
    return res.locals.operation ? res.locals.operation.generateResponse(req, res) : next();
  });

  router.use((req, res) => {
    res.status(404).send({ message: 'Not found' });
  });

  router.use((err: Error, req: express.Request, res: express.Response): void => {
    res.status(500).send({ message: 'Something broke!' });
  });

  return router;
};
