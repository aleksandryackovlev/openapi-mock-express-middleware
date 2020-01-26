import fs from 'fs';

import express from 'express';

import createRouter from './router';
import Operations from './operations';

export interface Options {
  file: string;
  locale?: string;
}

const createMiddleware = ({ file, locale = 'en' }: Options): express.Router => {
  if (!fs.existsSync(file)) {
    throw new Error('File with the openapi docs does not exist');
  }

  const router = createRouter();
  const operations = new Operations({ file, locale });

  router.use('/{0,}', async (req, res, next) => {
    const operation = await operations.match(req);

    return operation ? res.json(operation.generateResponse()) : next();
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
