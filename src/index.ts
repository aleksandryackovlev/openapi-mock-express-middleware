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
  spec?: string | OpenAPIV3.Document;
  options?: Partial<JSFOptions & { randomizeExamples: boolean }>;
  configure?: JSFCallback;
}

export const createMockMiddleware = ({
  spec,
  options = {},
  configure,
}: MiddlewareOptions): express.Router => {
  if (typeof spec === 'string' && !fs.existsSync(spec)) {
    throw new Error(`OpenAPI spec not found at location: ${spec}`);
  } else if (spec === undefined) {
    throw new Error(`OpenAPI spec not provided`);
  }

  const router = createRouter();
  const operations = createOperations({ spec, options, callback: configure });

  router.use('/{0,}', async (req, res, next) => {
    res.locals.operation = await operations.match(req);
    res.locals.operations = {
      ...(res.locals.operations ? res.locals.operations : {}),
      [spec.toString()]: operations,
    };
    next();
  });

  router.use(isAuthenticated, validateHeaders, validatePath, validateQuery, validateBody);

  router.use((req, res, next) => {
    return res.locals.operation ? res.locals.operation.generateResponse(req, res) : next();
  });

  return router;
};
