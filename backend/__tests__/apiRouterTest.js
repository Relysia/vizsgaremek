const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');

const { startServer, stopServer, deleteAll } = require('./util/inMemDb');

describe('Api Router Tests', () => {
  test('Should return 200 if team endpoint works', async () => {
    const response = await request.get('/api');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Api Router is Working!');
  });
});
