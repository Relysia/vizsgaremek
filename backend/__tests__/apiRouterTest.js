const app = require('../app');
require('dotenv').config({ path: '.env.testing' });
const supertest = require('supertest');
const request = supertest(app);
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { startServer, stopServer, clearDatabase } = require('./util/inMemDb');

global.console.log = jest.fn();

describe('Api Router Tests', () => {
  beforeAll(async () => {
    await startServer();
  });

  let testUser;
  let token;

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
    token = jwt.sign({ google_id: '123456789' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
  });

  afterEach(async () => {
    await clearDatabase();
    await mock.reset();
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

  test('Should return 200 if get user endpoint works', async () => {
    await testUser.save();

    mock.onPost('https://oauth2.googleapis.com/token').reply(200, {
      access_token: 'ya29.a0ARrdaM8wJoIbUxw5rC2ES28ZNxGO_vm3yomLqt6XfftjZ7nAzGb3tf87B0lb_oR2iS2tHMX7Tz3eUUOeGXi2mrFm-gPQ5LhUGVExque_L7sjwO8cs_CYYXSpcTyeUC5qBfbnw7mofeZ71xtYGSl6CljDuPhO',
      expires_in: 3599,
      scope: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      token_type: 'Bearer',
      id_token:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlZjRiZDkwODU5MWY2OTdhOGE5Yjg5M2IwM2U2YTc3ZWIwNGU1MWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NjQ1Mzk0MTAyMDItZzdudDd0aWZlODR2c3ZpNWh0M2Fva2RkZDAxYTFmNm4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NjQ1Mzk0MTAyMDItZzdudDd0aWZlODR2c3ZpNWh0M2Fva2RkZDAxYTFmNm4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5NTU1NDQ1MTE0NDU4NDE3MjEiLCJlbWFpbCI6ImJhcmFueWFpcmlraUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkFBNllaSmJOTjQzVUNDN0k2MmZ2NGciLCJuYW1lIjoiUmlraSBCYXJhbnlhaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaTlBenVGT2tNQk5PZkpBSUZkbW1oVEVFenllRmwwWld4WmptREw4UT1zOTYtYyIsImdpdmVuX25hbWUiOiJSaWtpIiwiZmFtaWx5X25hbWUiOiJCYXJhbnlhaSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjI5NDc3NTQ0LCJleHAiOjE2Mjk0ODExNDR9.HnSss3FUkEoeVtsa52F3kvlhcIRMfGSjCd6TQzLeOrnLAdrQGIrKZgyc2TW-adJ81njEUoETa_WeBY--BoZZgheGmtC5Z1zrXAHzcCJ3xC_HLqijzuNslCCQkQal8M7u3LKAa-5w9h1M1sIaZ-80vszthF3JH6IwOrbQZIpfAbs_fzD4LpAud6HxXsx60MVDYrb_A9633pTnN0TrLyjORU19KyR-qABnPH7V6PzysxMZ1lKEdRP5Ro9-vtmcbPIhOqonvMdPNvc0amtOaS1vFwfAsCOMvuP1bWtxpEuO24vskzWfOUqNyuIvdu2G9is-R5wAVfZMAR-TB-UGe6GgTA',
    });

    const body = {
      code: '4%2F0AX4XfWghRp3k1wOWLINixdVdDoK4X54EwR2JeBoistG2wpfRbOdSbYOim2Vzy92_b1hqbQ',
    };

    await request.post('/api/register').set('Authorization', token).send(body);

    expect(global.console.log).toHaveBeenCalledWith('Error sending email!');
  });
});
