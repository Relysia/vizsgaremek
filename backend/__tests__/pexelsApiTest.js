const app = require('../app');
require('dotenv').config({ path: '.env' });
const supertest = require('supertest');
const request = supertest(app);

const { startServer, stopServer } = require('./util/inMemDb');

describe('Team Router Tests', () => {
  beforeAll(async () => {
    await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  // ---------------- Pexels Api Tests ----------------
  test('POST Pexels Api Video - should return 200 if pexels video request works', async () => {
    const body = {
      videoId: '3571264',
    };

    await request.post('/api/pexelsvideo').send(body).expect(200, 'https://player.vimeo.com/external/384761655.hd.mp4?s=5eecd63d94629aa928726912a5601a7577a3ca8a&profile_id=174&oauth2_token_id=57447761');
  });

  test('POST Pexels Api Photo - should return 200 if pexels photo request works', async () => {
    const body = {
      photoId: '572897',
    };

    await request
      .post('/api/pexelsphoto')
      .send(body)
      .expect(
        200,
        '{"id":572897,"width":6914,"height":4463,"url":"https://www.pexels.com/photo/mountain-covered-snow-under-star-572897/","photographer":"eberhard grossgasteiger","photographer_url":"https://www.pexels.com/@eberhardgross","photographer_id":121938,"avg_color":"#5D5A63","src":{"original":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg","large2x":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940","large":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","medium":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&h=350","small":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&h=130","portrait":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800","landscape":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200","tiny":"https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"},"liked":false}'
      );
  });

  test('POST Pexels Api Video - should return 400 if pexels api got a bad video id', async () => {
    const body = {
      videoId: '323157121021064210',
    };

    await request.post('/api/pexelsvideo').send(body).expect(400, 'Error getting pexels video!');
  });

  test('POST Pexels Api Photo - should return 400 if pexels api got a bad photo id', async () => {
    const body = {
      videoId: '323157121021064210',
    };

    await request.post('/api/pexelsphoto').send(body).expect(400, 'Error getting pexels photo!');
  });
});
