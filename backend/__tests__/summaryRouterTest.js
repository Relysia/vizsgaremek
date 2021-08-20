const app = require('../app');
require('dotenv').config({ path: '.env' });
const supertest = require('supertest');
const request = supertest(app);
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Team = require('../models/team');
const Budget = require('../models/budget');

const { startServer, stopServer, clearDatabase } = require('./util/inMemDb');

describe('Team Router Tests', () => {
  beforeAll(async () => {
    await startServer();
  });

  let testUser;
  let testTeam;
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

    // Creating test team in database
    testTeam = new Team({
      calendar_id: '123456789@group.calendar.google.com',
      title: 'The Test Team',
      leader: {
        name: 'Brad Pitt',
        email: 'bradpitt@gmail.com',
        picture: 'bradpitt.jpg',
        role: 'Director',
      },
      members: {
        name: 'Test John',
        picture: 'testjohn.jpg',
        role: 'Actor',
        google_id: '012345678',
        email: 'testjohn@gmail.com',
      },
    });

    testBudget = new Budget({
      calendar_id: '123456789@group.calendar.google.com',
      google_id: '123456789',
      public: true,
      cast_total: 250000,
      rent_total: 360000,
      travel_total: 3150,
      food_total: 30000,
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

  // ---------------- GET /api/summary ----------------
  test('GET /api/summary - should return 200 if calendar is shared with the authorized user', async () => {
    await testUser.save();
    await testTeam.save();
    await testBudget.save();

    // MOCK GOOGLE CALENDAR RESPONSE
    mock.onGet('https://www.googleapis.com/calendar/v3/calendars/123456789@group.calendar.google.com/events?singleEvents=true&orderBy=startTime').reply(200, {
      items: [
        {
          summary: 'Shooting',
          start: { dateTime: '2021-08-19T13:00:00Z' },
          end: { dateTime: '2021-08-19T15:00:00Z' },
          htmlLink: 'https://www.google.com/calendar/event?eid=Ymo0NTV1MnIybnNkZDVhZXBoaGk4dHIwdTQgZWw2Y2Y2bWM4bWkxczE0cWZwM3Q5Nzg1MjhAZw',
        },
      ],
    });

    await request
      .post('/api/summary')
      .set('Authorization', token)
      .expect(200, {
        team: { title: 'The Test Team', leader: { name: 'Brad Pitt', picture: 'bradpitt.jpg', role: 'Director' }, members: [{ name: 'Test John', picture: 'testjohn.jpg', role: 'Actor' }] },
        budget: { total: 643150, budget: { cast_total: 250000, rent_total: 360000, travel_total: 3150, food_total: 30000 } },
        calendar: { events: [{ summary: 'Shooting', start: { dateTime: '2021-08-19T13:00:00Z' }, htmlLink: 'https://www.google.com/calendar/event?eid=Ymo0NTV1MnIybnNkZDVhZXBoaGk4dHIwdTQgZWw2Y2Y2bWM4bWkxczE0cWZwM3Q5Nzg1MjhAZw' }] },
      });
  });

  test('GET /api/summary - should return 200 if calendar is not shared with the authorized user and calendar should be an empty string', async () => {
    await testUser.save();
    await testTeam.save();
    await testBudget.save();

    await request
      .post('/api/summary')
      .set('Authorization', token)
      .expect(200, {
        team: { title: 'The Test Team', leader: { name: 'Brad Pitt', picture: 'bradpitt.jpg', role: 'Director' }, members: [{ name: 'Test John', picture: 'testjohn.jpg', role: 'Actor' }] },
        budget: { total: 643150, budget: { cast_total: 250000, rent_total: 360000, travel_total: 3150, food_total: 30000 } },
        calendar: '',
      });
  });

  test('GET /api/summary - should return 404 if user has no team and has team leader role', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
      roles: {
        team_leader: true,
      },
      team: {
        calendar_id: '',
        title: '',
      },
    });

    await testUser.save();
    await testTeam.save();
    await testBudget.save();

    await request.post('/api/summary').set('Authorization', token).expect(404, 'You need to create a team first!');
  });

  test('GET /api/summary - should return 404 if user has no team and is not a team leader', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
      roles: {
        team_leader: false,
      },
      team: {
        calendar_id: '',
        title: '',
      },
    });

    await testUser.save();
    await testTeam.save();
    await testBudget.save();

    await request.post('/api/summary').set('Authorization', token).expect(404, 'You need to join a team first!');
  });

  test('GET /api/summary - should return 200 and an empty string for budget, if team budget is not public', async () => {
    await clearDatabase();

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

    // Creating test team in database
    testTeam = new Team({
      calendar_id: '123456789@group.calendar.google.com',
      title: 'The Test Team',
      leader: {
        google_id: '012345678',
        name: 'Test John',
        email: 'testjohn@gmail.com',
        picture: 'testjohn.jpg',
        role: 'Director',
      },
      members: {
        google_id: '123456789',
        name: 'Brad Pitt',
        picture: 'bradpitt.jpg',
        role: 'Actor',
        email: 'bradpitt@gmail.com',
      },
    });

    testBudget = new Budget({
      calendar_id: '123456789@group.calendar.google.com',
      google_id: '123456789',
      public: false,
      cast_total: 250000,
      rent_total: 360000,
      travel_total: 3150,
      food_total: 30000,
    });

    await testUser.save();
    await testTeam.save();
    await testBudget.save();

    await request
      .post('/api/summary')
      .set('Authorization', token)
      .expect(200, { team: { title: 'The Test Team', leader: { name: 'Test John', picture: 'testjohn.jpg', role: 'Director' }, members: [{ name: 'Brad Pitt', picture: 'bradpitt.jpg', role: 'Actor' }] }, budget: { total: '', budget: '' }, calendar: '' });
  });
});
