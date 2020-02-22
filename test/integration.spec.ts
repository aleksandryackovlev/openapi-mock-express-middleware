import supertest from 'supertest';

import app from './helpers/app';

const request = supertest(app);

describe('middleware', () => {
  it("should return fields' example values if they are set", async () => {
    const response = await request.get('/api/pet/2').set('api_key', 'someKey');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'doggie');
    expect(response.body).toHaveProperty('photoUrls', ['http://test.test', 'http://test1.test1']);
  });

  it('should return the first example from the examples list in the response', async () => {
    const response = await request.get('/api/pet/someOperation');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'first example name');
    expect(response.body).toHaveProperty('photo', 'http://some-url-first.com');
  });

  it('should return randomly generated values if examples are not specified for them', async () => {
    const response = await request.get('/api/pet/someOtherOperation');

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('name');
    expect(typeof response.body.name).toBe('string');

    expect(response.body).toHaveProperty('photo');
    expect(typeof response.body.photo).toBe('string');
    expect(response.body.photo.startsWith('http')).toBe(true);
  });

  it('should return values of the given faker type if they are specified', async () => {
    const response = await request.post('/api/pet/2').set('Authorization', 'Bearer key');

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('number');

    expect(response.body).toHaveProperty('name');
    expect(typeof response.body.name).toBe('string');
  });

  it('should return an 404 error response if the given url does not exist', async () => {
    const response = await request.get('/api/pet-not-exist/2');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Not found');
  });

  it('should return an 400 error response if request body is not valid', async () => {
    const response = await request
      .post('/api/pet')
      .set('Authorization', 'Bearer key')
      .send({ name: 'doggie', photoUrls: ['http://some-url.com'], status: 'incorrect' });

    expect(response.status).toBe(400);
  });

  it('should return an 400 error response if path params are not valid', async () => {
    const response = await request.get('/api/pet/foo').set('api_key', 'someKey');

    expect(response.status).toBe(400);
  });

  it('should return an 400 error response if query params are not valid', async () => {
    const response = await request
      .get('/api/pet/findByStatus?status[]=string&status[]=available')
      .set('Authorization', 'Bearer key');

    expect(response.status).toBe(400);
  });

  it('should return an 400 error response if headers params are not valid', async () => {
    const response = await request.delete('/api/pet/2').set('Authorization', 'Bearer key');

    expect(response.status).toBe(400);
  });

  it('should return an 401 error response if security schema params are not valid', async () => {
    const response = await request.get('/api/pet/2');

    expect(response.status).toBe(401);
  });

  it('should return an 400 error response on invalid content-type request', async () => {
    const response = await request
      .post('/api/pet')
      .set('Authorization', 'Bearer key')
      .type('form')
      .send({ name: 'doggie' })
      .send({ photoUrls: ['http://some-url.com'] });

    expect(response.status).toBe(400);
  });
});
