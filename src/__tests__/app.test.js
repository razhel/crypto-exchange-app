const request = require('supertest');
const app = require('../app');

describe('Health endpoint', () => {
  it('should respond with status 200 and healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});

