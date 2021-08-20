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
      members: {
        google_id: '012345678',
        email: 'testjohn@gmail.com',
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

  test('GET /api/calendar - should return 200 for calendar route if authorization provided', async () => {
    await testUser.save();

    await request.get('/api/calendar').set('Authorization', token).expect(200, 'Calendar route is working!');
  });

  // ---------------- GET /api/calendar/newevent ----------------
  test('GET /api/calendar/newevent - should return 400 if body is empty', async () => {
    await testUser.save();
    await testTeam.save();

    const body = {
      title: 'Meeting',
      location: 'Hungary, Budapest',
      description: 'Crew Meeting',
      colorId: '1',
      startDate: '2021-08-19',
      startTime: '13:00',
      endDate: '2021-08-19',
      endTime: '15:00',
    };

    await request.post('/api/calendar/newevent').send(body).set('Authorization', token).expect(400, 'There was an error, sending your event!');
  });

  test('GET /api/calendar/newevent - should return 200 if access token is correct and body is not empty', async () => {
    await testUser.save();
    await testTeam.save();

    const body = {
      title: 'Meeting',
      location: 'Hungary, Budapest',
      description: 'Crew Meeting',
      colorId: '1',
      startDate: '2021-08-19',
      startTime: '13:00',
      endDate: '2021-08-19',
      endTime: '15:00',
    };

    // MOCK GOOGLE CALENDAR RESPONSE
    mock.onPost('https://www.googleapis.com/calendar/v3/calendars/123456789@group.calendar.google.com/events').reply(200, {
      kind: 'calendar#event',
      etag: '"3258759527372000"',
      id: 'bj455u2r2nsdd5aephhi8tr0u4',
      status: 'confirmed',
      htmlLink: 'https://www.google.com/calendar/event?eid=Ymo0NTV1MnIybnNkZDVhZXBoaGk4dHIwdTQgZWw2Y2Y2bWM4bWkxczE0cWZwM3Q5Nzg1MjhAZw',
      created: '2021-08-19T13:29:23.000Z',
      updated: '2021-08-19T13:29:23.686Z',
      summary: 'Meeting',
      description: 'Crew Meeting',
      location: 'Hungary, Budapest',
      colorId: '1',
      creator: { email: 'bradpitt@gmail.com' },
      organizer: {
        email: '123456789@group.calendar.google.com',
        displayName: 'Filmsquad - The Test Team',
        self: true,
      },
      start: { dateTime: '2021-08-19T13:00:00Z', timeZone: 'Europe/Budapest' },
      end: { dateTime: '2021-08-19T15:00:00Z', timeZone: 'Europe/Budapest' },
      iCalUID: 'bj455u2r2nsdd5aephhi8tr0u4@google.com',
      sequence: 0,
      reminders: { useDefault: true },
      eventType: 'default',
    });

    await request.post('/api/calendar/newevent').send(body).set('Authorization', token).expect(200, 'Event has been recorded successfully!');
  });

  // ---------------- GET /api/calendar/getupcomming ----------------
  test('GET /api/calendar/getupcomming - should return 200 if access token is correct', async () => {
    await testUser.save();
    await testTeam.save();

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
      .get('/api/calendar/getupcomming')
      .set('Authorization', token)
      .expect(200, [{ summary: 'Shooting', start: { dateTime: '2021-08-19T13:00:00Z' }, end: { dateTime: '2021-08-19T15:00:00Z' }, htmlLink: 'https://www.google.com/calendar/event?eid=Ymo0NTV1MnIybnNkZDVhZXBoaGk4dHIwdTQgZWw2Y2Y2bWM4bWkxczE0cWZwM3Q5Nzg1MjhAZw' }]);
  });

  test('GET /api/calendar/getupcomming - should return 400 if access token is bad', async () => {
    await testUser.save();
    await testTeam.save();

    await request.get('/api/calendar/getupcomming').set('Authorization', token).expect(400, 'Error getting calendar events!');
  });

  // ---------------- POST /api/calendar/addcalendar ----------------
  test('GET /api/calendar/addcalendar - should return 400 if access token is bad', async () => {
    await testUser.save();
    await testTeam.save();

    const body = {
      email: 'bradpitt@gmail.com',
    };

    await request.post('/api/calendar/addcalendar').set('Authorization', token).send(body).expect(400, 'Error adding calendar!');
  });

  test('GET /api/calendar/addcalendar - should return 200 if access token is correct and email is a match in database', async () => {
    await testUser.save();
    await testTeam.save();

    const body = {
      email: 'testjohn@gmail.com',
    };

    mock.onPost('https://www.googleapis.com/calendar/v3/users/me/calendarList').reply(200);

    await request.post('/api/calendar/addcalendar').set('Authorization', token).send(body).expect(200);
  });

  // ---------------- POST /api/calendar/calendarrole ----------------
  test('GET /api/calendar/calendarrole - should return 200 if auth user found in the team members array', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '012345678',
      name: 'Test John',
      email: 'testjohn@gmail.com',
      picture: 'testjohn.jpg',
      team: {
        calendar_id: '123456789@group.calendar.google.com',
        title: 'Test Team Title',
      },
    });

    const memberToken = jwt.sign({ google_id: '012345678', access_token: '987654321' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });

    await testUser.save();
    await testTeam.save();

    await request.post('/api/calendar/calendarrole').set('Authorization', memberToken).expect(200);
  });

  // ---------------- POST /api/calendar/sharecalendar ----------------
  test('GET /api/calendar/sharecalendar - should return 400 if access token not correct ', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '012345678',
      name: 'Test John',
      email: 'testjohn@gmail.com',
      picture: 'testjohn.jpg',
      team: {
        calendar_id: '123456789@group.calendar.google.com',
        title: 'Test Team Title',
      },
    });

    const memberToken = jwt.sign({ google_id: '012345678', access_token: '987654321' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });

    await testUser.save();
    await testTeam.save();

    const body = {
      email: 'testjohn@gmail.com',
    };

    await request.post('/api/calendar/sharecalendar').set('Authorization', memberToken).send(body).expect(400, 'Error sharing calendar!');
  });

  test('GET /api/calendar/sharecalendar - should return 200 if access token is correct ', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '012345678',
      name: 'Test John',
      email: 'testjohn@gmail.com',
      picture: 'testjohn.jpg',
      team: {
        calendar_id: '123456789@group.calendar.google.com',
        title: 'Test Team Title',
      },
    });

    const memberToken = jwt.sign({ google_id: '012345678', access_token: '987654321' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });

    await testUser.save();
    await testTeam.save();

    mock.onPost('https://www.googleapis.com/calendar/v3/calendars/123456789@group.calendar.google.com/acl').reply(200);

    const body = {
      email: 'testjohn@gmail.com',
    };

    await request.post('/api/calendar/sharecalendar').set('Authorization', memberToken).send(body).expect(200, 'Successfully shared!');
  });
});
