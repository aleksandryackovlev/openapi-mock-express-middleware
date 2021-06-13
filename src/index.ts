/* eslint-disable no-console */
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
  file?: string;
  spec?: string | OpenAPIV3.Document;
  locale?: string;
  options?: Partial<JSFOptions>;
  jsfCallback?: JSFCallback;
}

export const createMockMiddleware = ({
  /**
   * @deprecated
   */
  file,
  spec,
  locale = 'en',
  options = {},
  jsfCallback,
}: MiddlewareOptions): express.Router => {
  if (file) {
    console.warn('The file option is deprecated. Please, use spec option instead.');
  }

  const docSpec = !spec ? file : spec;
  if (typeof docSpec === 'string' && !fs.existsSync(docSpec)) {
    throw new Error(`OpenAPI spec not found at location: ${docSpec}`);
  } else if (docSpec === undefined) {
    throw new Error(`OpenAPI spec not provided`);
  }

  const router = createRouter();
  const operations = createOperations({ spec: docSpec, locale, options, callback: jsfCallback });

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
