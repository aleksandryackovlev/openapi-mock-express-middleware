import path from 'path';

import express from 'express';

import { createMockMiddleware } from '../../src';

const app = express();

const middleware = createMockMiddleware({
  spec: path.resolve(__dirname, '../fixtures/petstore.yaml'),
  options: {
    useExamplesValue: false,
  },
});

app.use('/api', middleware);

export default app;
