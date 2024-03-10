import supertest from 'supertest';

import app from './helpers/app-no-examples';

const request = supertest(app);

describe('middleware', () => {
  it('should not use example values if useExamplesValue is set to false', async () => {
    const response = await request.get('/api/pet/2').set('api_key', 'someKey');

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('name', 'doggie');
    expect(response.body).not.toHaveProperty('photoUrls', [
      'http://test.test',
      'http://test1.test1',
    ]);
  });
});
