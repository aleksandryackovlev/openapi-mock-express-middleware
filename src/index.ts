import fs from 'fs';

import express from 'express';

import createRouter from './router';
import { createOperations } from './operations';
import { isAuthenticated, validateHeaders, validatePath, validateQuery } from './middleware';

export interface Options {
  file: string;
  locale?: string;
}

const createMiddleware = ({ file, locale = 'en' }: Options): express.Router => {
  if (!fs.existsSync(file)) {
    throw new Error('File with the openapi docs does not exist');
  }

  const router = createRouter();
  const operations = createOperations({ file, locale });

  router.use('/{0,}', async (req, res, next) => {
    res.locals.operation = await operations.match(req);
    next();
  });

  router.use(isAuthenticated, validateHeaders, validatePath, validateQuery);

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

export default createMiddleware;
