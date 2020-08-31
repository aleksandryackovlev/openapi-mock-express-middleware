import fs from 'fs';

import express from 'express';
import { CorsOptions } from 'cors';

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
  file: string;
  locale?: string;
  options?: Partial<JSFOptions>;
  cors?: CorsOptions & { enabled?: boolean };
  jsfCallback?: JSFCallback;
}

export const createMockMiddleware = ({
  file,
  locale = 'en',
  options = {},
  cors = {
    enabled: true,
    origin: '*',
    maxAge: 31536000,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  },
  jsfCallback,
}: MiddlewareOptions): express.Router => {
  if (!fs.existsSync(file)) {
    throw new Error('File with the openapi docs does not exist');
  }

  const router = createRouter(cors);
  const operations = createOperations({ file, locale, options, callback: jsfCallback });

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
