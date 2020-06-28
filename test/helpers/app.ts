import path from 'path';

import express from 'express';

import { createMockMiddleware } from '../../src';

const app = express();

const middleware = createMockMiddleware({
  file: path.resolve(__dirname, '../fixtures/petstore.yaml'),
});

app.use('/api', middleware);

export default app;
