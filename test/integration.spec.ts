import supertest from 'supertest';

import app from './helpers/app';

const request = supertest(app);

describe('middleware', () => {
  it('should work', async () => {
    const response = await request.get('/api/pet/2');

    expect(response.status).toBe(200);
  });
});
