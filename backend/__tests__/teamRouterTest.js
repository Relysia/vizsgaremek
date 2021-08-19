const app = require('../app');
require('dotenv').config({ path: '.env' });
const supertest = require('supertest');
const request = supertest(app);
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
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
    token = jwt.sign({ google_id: '123456789', access_token: '987654321' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
  });

  afterEach(async () => {
    await clearDatabase();
    await mock.reset();
  });

  afterAll(async () => {
    await stopServer();
  });

  test('GET /api/team - should return 200 for team route if authorization provided', async () => {
    await testUser.save();

    await request.get('/api/team').set('Authorization', token).expect(200, 'Teams route is working!');
  });

  // ---------------- GET /api/team/getteam ----------------
  test('GET /api/team/getteam - should return 200 if there is a team in database', async () => {
    await testUser.save();

    // Creating test team in database
    const testTeam = new Team({
      calendar_id: '123456789@group.calendar.google.com',
      title: 'Test Team',
    });

    await testTeam.save();

    await request.get('/api/team/getteam').set('Authorization', token).expect(200);
  });

  test('GET /api/team/getteam - should return 400 if there is no team in database', async () => {
    await testUser.save();

    await request.get('/api/team/getteam').set('Authorization', token).expect(400, 'No team available to join!');
  });

  // ---------------- POST /api/team/create ----------------
  test('POST /api/team/create - should return 200 if access token is correct for google calendar api', async () => {
    await testUser.save();

    // api/team/create requires title and teamRole in body
    const body = {
      title: 'The Test Team',
      teamRole: 'Director',
    };

    mock.onPost('https://www.googleapis.com/calendar/v3/calendars').reply(200, {
      kind: 'calendar#calendar',
      etag: '"Ah5xDDRS_nYAEOhJCh9CQZpq8vg"',
      id: '123456789@group.calendar.google.com',
      summary: 'Filmsquad - The Test Team',
      timeZone: 'UTC',
    });

    await request.post('/api/team/create').set('Authorization', token).send(body).expect(200, 'New team is created!');
  });

  test('POST /api/team/create - should return 400 for sending bad access token to google calendar api', async () => {
    await testUser.save();

    // api/team/create requires title and teamRole in body
    const body = {
      title: 'Test Team Title',
      teamRole: 'Director',
    };

    await request.post('/api/team/create').set('Authorization', token).send(body).expect(400, 'Error creating team');
  });

  test('POST /api/team/create - should return 400 if title is missing from body', async () => {
    await testUser.save();

    await request.post('/api/team/create').set('Authorization', token).expect(400, 'Title is required!');
  });

  test('POST /api/team/create - should return 400 if teamRole is missing from body', async () => {
    await testUser.save();

    const body = {
      title: 'Test Team Title',
    };

    await request.post('/api/team/create').set('Authorization', token).send(body).expect(400, 'Team role is required!');
  });

  // ---------------- POST /api/team/userteam ----------------
  test('POST /api/team/userteam - should return 200 if user calendarID has a match with a team in database', async () => {
    await testUser.save();

    // Creating test team in database
    const testTeam = new Team({
      calendar_id: '123456789@group.calendar.google.com',
      title: 'Test Team',
      leader: {
        name: 'Brad Pitt',
        picture: 'bradpitt.jpg',
        role: 'Director',
      },
      members: [
        {
          name: 'Tom Hanks',
          email: 'tomhanks@gmail.com',
          picture: 'tomhanks.jpg',
          role: 'Actor',
          calendar_share: false,
          calendar_join: false,
        },
      ],
    });

    await testTeam.save();

    await request.post('/api/team/userteam').set('Authorization', token).expect(200);
  });

  test('POST /api/team/userteam - should return 400 if no match with user calendarID', async () => {
    await testUser.save();

    // Creating test team in database
    const testTeam = new Team({
      calendar_id: '01234567890@group.calendar.google.com',
      title: 'Test Team Title',
    });

    await testTeam.save();

    await request.post('/api/team/userteam').set('Authorization', token).expect(404);
  });

  // ---------------- POST /api/team/jointeam ----------------
  test('POST /api/team/jointeam - should return 404 if the team is not found', async () => {
    await testUser.save();

    // Creating test team in database
    const testTeam = new Team({
      calendar_id: '01234567890@group.calendar.google.com',
      title: 'Test Team Title',
    });

    await testTeam.save();

    const body = {
      calendar_id: '123456789@group.calendar.google.com',
      role: 'Actor',
    };

    await request.post('/api/team/jointeam').set('Authorization', token).send(body).expect(404, 'Team not found!');
  });

  test('POST /api/team/jointeam - should return 200 if team database has a match with calendar id', async () => {
    await testUser.save();

    // Creating test team in database
    const testTeam = new Team({
      calendar_id: '123456789@group.calendar.google.com',
      title: 'Test Team Title',
    });

    await testTeam.save();

    const body = {
      calendar_id: '123456789@group.calendar.google.com',
      role: 'Actor',
    };

    await request.post('/api/team/jointeam').set('Authorization', token).send(body).expect(200, 'Successfully joined team!');
  });

  // ---------------- POST /api/team/teamauth ----------------
  test('POST /api/team/teamauth - should return 200 if the user has a team', async () => {
    await testUser.save();

    await request.post('/api/team/teamauth').set('Authorization', token).expect(200, 'Success!');
  });

  test('POST /api/team/teamauth - should return 404 if user has no team, and has no leader role', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
      roles: {
        team_leader: false,
      },
    });

    await testUser.save();

    await request.post('/api/team/teamauth').set('Authorization', token).expect(404, 'You need to join a team first!');
  });

  test('POST /api/team/teamauth - should return 404 if user has no team, and has leader role', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
      roles: {
        team_leader: true,
      },
    });

    await testUser.save();

    await request.post('/api/team/teamauth').set('Authorization', token).expect(404, 'You need to create a team first!');
  });
});
