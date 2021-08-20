const app = require('../app');
require('dotenv').config({ path: '.env' });
const supertest = require('supertest');
const request = supertest(app);
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
      uniqueString: '333333',
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

  // ---------------- POST google auth ----------------
  test('POST google auth - should return 400 if google auth is not working', async () => {
    await testUser.save();

    await request.post('/api/register').set('Authorization', token).expect(400, 'Google Authentication error!');
  });

  // ---------------- POST /api/register ----------------
  test('POST /api/register - should return 200 if google auth works and user not exists in database', async () => {
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

    await request.post('/api/register').set('Authorization', token).send(body).expect(200, 'Confirmation link has been sent to your email: baranyairiki@gmail.com');
  });

  test('POST /api/register - should return 403 if user already exists in database', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '108955544511445841721',
      name: 'Test User',
      email: 'testuser@gmail.com',
      picture: 'testuser.jpg',
    });

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

    await request.post('/api/register').set('Authorization', token).send(body).expect(403, 'You already registered with this email!');
  });

  // ---------------- POST /api/login ----------------
  test('POST /api/login - should return 200 if google auth works and user has a confirmed email address', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '108955544511445841721',
      name: 'Test User',
      email: 'testuser@gmail.com',
      picture: 'testuser.jpg',
      isValid: true,
    });

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

    await request.post('/api/login').set('Authorization', token).send(body).expect(200);
  });

  test('POST /api/login - should return 401 if google auth works but user not confirmed the email address', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '108955544511445841721',
      name: 'Test User',
      email: 'testuser@gmail.com',
      picture: 'testuser.jpg',
      isValid: false,
    });

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

    await request.post('/api/login').set('Authorization', token).send(body).expect(401, 'You need to confirm your email address!');
  });

  test('POST /api/login - should return 401 if google auth works but user is not registered', async () => {
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

    await request.post('/api/login').set('Authorization', token).send(body).expect(401, 'You need to sign up first!');
  });

  // ---------------- POST /api/getroles ----------------
  test('POST /api/getroles - should return 200 if user found in the database', async () => {
    await testUser.save();

    await request.post('/api/getroles').set('Authorization', token).expect(200, { leader: false, calendar_id: '' });
  });

  // ---------------- POST /api/getroles ----------------
  test('POST /api/role - should return 200 if changing user role works', async () => {
    await testUser.save();

    leaderBody = {
      role: 'leader',
    };

    await request.post('/api/role').set('Authorization', token).send(leaderBody).expect(200);

    memberBody = {
      role: 'member',
    };

    await request.post('/api/role').set('Authorization', token).send(memberBody).expect(200);
  });

  test('POST /api/role - should return 400 if user not found in database', async () => {
    await testUser.save();

    body = {
      role: 'leader',
    };

    roleToken = jwt.sign({ google_id: '01234567890', access_token: '987654321' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });

    await request.post('/api/role').set('Authorization', roleToken).send(body).expect(400);
  });

  test('POST /api/confirm - should return 200 if confirmation body is valid', async () => {
    await testUser.save();

    body = {
      code: '333333',
      email: 'bradpitt@gmail.com',
    };

    await request.post('/api/confirm').set('Authorization', token).send(body).expect(200, 'Email successfully confirmed!');
  });

  test('POST /api/confirm - should return 400 if confirmation body is not valid', async () => {
    await testUser.save();

    badCodeBody = {
      code: '111111',
      email: 'bradpitt@gmail.com',
    };

    await request.post('/api/confirm').set('Authorization', token).send(badCodeBody).expect(400, 'Invalid confirmation link!');

    badEmailBody = {
      code: '333333',
      email: 'bademail@gmail.com',
    };

    await request.post('/api/confirm').set('Authorization', token).send(badEmailBody).expect(400, 'Invalid confirmation link!');
  });
});
