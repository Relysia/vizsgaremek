const app = require('../app');
require('dotenv').config({ path: '.env' });
const supertest = require('supertest');
const request = supertest(app);
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { startServer, stopServer, clearDatabase } = require('./util/inMemDb');

describe('Api Router Tests', () => {
  beforeAll(async () => {
    await startServer();
  });

  let testUser;
  let token;

  beforeEach(async () => {
    // Creating auth user in database
    testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
      team: {
        calendar_id: '123456789@group.calendar.google.com',
        title: 'Test Team Title',
      },
    });

    // Sign jwt token with google id and access_token
    token = jwt.sign({ google_id: '123456789' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await stopServer();
  });

  test('Should return 200 if team endpoint works', async () => {
    const response = await request.get('/api');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Api Router is Working!');
  });

  test('Should return 200 if get user endpoint works', async () => {
    const body = {
      jwt: token,
    };

    await request.post('/api/user').send(body).expect(200);
  });
});
