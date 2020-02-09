import path from 'path';

import express from 'express';

import createMiddleware from '../../src';

const app = express();

const middleware = createMiddleware({
  file: path.resolve(__dirname, '../fixtures/petstore.yaml'),
});

app.use('/api', middleware);

export default app;
