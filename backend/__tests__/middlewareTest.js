const app = require('../app');
require('dotenv').config({ path: '.env' });
const supertest = require('supertest');
const request = supertest(app);
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Team = require('../models/team');

const { startServer, stopServer, clearDatabase } = require('./util/inMemDb');

describe('Team Router Tests', () => {
  beforeAll(async () => {
    await startServer();
  });

  let testUser;
  let token;
  let mock;

  beforeEach(async () => {
    mock = new MockAdapter(axios);
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
    token = jwt.sign({ google_id: '123456789', access_token: '987654321' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
  });

  afterEach(async () => {
    await clearDatabase();
    await mock.reset();
  });

  afterAll(async () => {
    await stopServer();
  });

  // ---------------- Error Handler Middleware ----------------
  test('Error Handler Middleware - should return 500 server error for bad requests', async () => {
    await testUser.save();

    await request.post('/api/undefinedroute').set('Authorization', token).expect(500, 'There is a server error!');
  });

  // ---------------- User Auth Middleware ----------------
  test('User Auth Middleware - should return 401 if jwt is invalid or expired', async () => {
    await testUser.save();

    expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVfaWQiOiIxMjM0NTY3ODkiLCJhY2Nlc3NfdG9rZW4iOiI5ODc2NTQzMjEiLCJpYXQiOjE2Mjk0NzE5OTIsImV4cCI6MTYyOTQ3MTk5OX0.HxsBvBXYTuaEYlAHOGpvzmMEDt-Svp0s8saAIElOo3I';

    await request.get('/api/team').set('Authorization', expiredJWT).expect(401, 'Your session has expired. You need to login again!');
  });

  // ---------------- User Exists Middleware ----------------
  test('User Exists Middleware - should return 404 if user not found in db', async () => {
    await testUser.save();

    jwtWithBadGoogleId = jwt.sign({ google_id: '123456789BAD' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });

    await request.get('/api/team').set('Authorization', jwtWithBadGoogleId).expect(404, 'User not found. Please sign up!');
  });
});
