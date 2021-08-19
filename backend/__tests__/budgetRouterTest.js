const app = require('../app');
require('dotenv').config({ path: '.env' });
const supertest = require('supertest');
const request = supertest(app);
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Budget = require('../models/budget');

const { startServer, stopServer, clearDatabase } = require('./util/inMemDb');

describe('Budget Router Tests', () => {
  beforeAll(async () => {
    await startServer();
  });

  let testUser;
  let testBudget;
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

    // Creating Test Budget in Database
    testBudget = new Budget({
      calendar_id: '123456789@group.calendar.google.com',
      google_id: '123456789',
      public: true,
      cast_total: 250000,
      cast: [
        {
          cast_role: 'Actor',
          cast_name: 'Brad Pitt',
          cast_cost: 250000,
        },
      ],
      rent_total: 360000,
      rent: [
        {
          rent_type: 'House',
          rent_name: 'Timberline',
          rent_cost: 360000,
        },
      ],
      travel_total: 3150,
      travel: [
        {
          travel_distance: 100,
          travel_car_cons: 7,
          travel_litre_cost: 450,
        },
        {
          travel_distance: 50,
          travel_car_cons: 7,
          travel_litre_cost: 450,
        },
      ],
      food_total: 30000,
      food: [
        {
          food_day: 'Monday',
          food_cost: 30000,
        },
      ],
    });

    // Sign jwt token with google id
    token = jwt.sign({ google_id: '123456789' }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await stopServer();
  });

  // ---------------- GET /api/budget/get ----------------
  test('GET /api/budget/get - should return 200 if get cast budget works with test data', async () => {
    await testUser.save();
    await testBudget.save();

    // GET cast item from database
    const castBody = {
      type: 'cast',
    };
    const castResponse = await request.post('/api/budget/get').send(castBody).set('Authorization', token).expect(200);

    // GET rent item from database
    const rentBody = {
      type: 'rent',
    };
    const rentResponse = await request.post('/api/budget/get').send(rentBody).set('Authorization', token).expect(200);

    // GET travel item from database
    const travelBody = {
      type: 'travel',
    };
    const travelResponse = await request.post('/api/budget/get').send(travelBody).set('Authorization', token).expect(200);

    // GET food item from database
    const foodBody = {
      type: 'food',
    };
    const foodResponse = await request.post('/api/budget/get').send(foodBody).set('Authorization', token).expect(200);

    // Getting cast datas
    expect(castResponse.body.total).toBe(250000);
    expect(castResponse.body.budget[0].cast_role).toBe('Actor');
    expect(castResponse.body.budget[0].cast_name).toBe('Brad Pitt');
    expect(castResponse.body.budget[0].cast_cost).toBe(250000);

    // Getting rent datas
    expect(rentResponse.body.total).toBe(360000);
    expect(rentResponse.body.budget[0].rent_type).toBe('House');
    expect(rentResponse.body.budget[0].rent_name).toBe('Timberline');
    expect(rentResponse.body.budget[0].rent_cost).toBe(360000);

    // Getting travel datas
    expect(travelResponse.body.total).toBe(3150);
    expect(travelResponse.body.budget[0].travel_distance).toBe(100);
    expect(travelResponse.body.budget[0].travel_car_cons).toBe(7);
    expect(travelResponse.body.budget[0].travel_litre_cost).toBe(450);

    // Getting food datas
    expect(foodResponse.body.total).toBe(30000);
    expect(foodResponse.body.budget[0].food_day).toBe('Monday');
    expect(foodResponse.body.budget[0].food_cost).toBe(30000);
  });

  // ---------------- POST /api/budget/post ----------------
  test('POST /post/budget/post - should return 200 if posting a new budget item works and database have the new item', async () => {
    await testUser.save();
    await testBudget.save();

    // New cast item
    const castBody = {
      type: 'cast',
      first: 'Actor',
      second: 'Tom Hanks',
      third: 200000,
    };
    await request.post('/api/budget/post').send(castBody).set('Authorization', token).expect(200, 'Successfully added new cast member!');

    // New rent item
    const rentBody = {
      type: 'rent',
      first: 'House',
      second: 'Hotel Budapest',
      third: 150000,
    };
    await request.post('/api/budget/post').send(rentBody).set('Authorization', token).expect(200, 'Successfully added new cast member!');

    // New travel item
    const travelBody = {
      type: 'travel',
      first: 50,
      second: 7,
      third: 450,
    };
    await request.post('/api/budget/post').send(travelBody).set('Authorization', token).expect(200, 'Successfully added new cast member!');

    // New food item
    const foodBody = {
      type: 'food',
      first: 'Sunday',
      second: 15000,
    };
    await request.post('/api/budget/post').send(foodBody).set('Authorization', token).expect(200, 'Successfully added new cast member!');

    // Check if the database has the new item
    const budgetResult = await Budget.findOne({ calendar_id: testUser.team.calendar_id });

    // Check the new cast item
    const newCastItem = budgetResult.cast[budgetResult.cast.length - 1];
    expect(newCastItem.cast_role).toBe('Actor');
    expect(newCastItem.cast_name).toBe('Tom Hanks');
    expect(newCastItem.cast_cost).toBe(200000);
    expect(budgetResult.cast_total).toBe(450000);

    // Check the new rent item
    const newRentItem = budgetResult.rent[budgetResult.rent.length - 1];
    expect(newRentItem.rent_type).toBe('House');
    expect(newRentItem.rent_name).toBe('Hotel Budapest');
    expect(newRentItem.rent_cost).toBe(150000);
    expect(budgetResult.rent_total).toBe(510000);

    // Check the new travel item
    const newTravelItem = budgetResult.travel[budgetResult.travel.length - 1];
    expect(newTravelItem.travel_distance).toBe(50);
    expect(newTravelItem.travel_car_cons).toBe(7);
    expect(newTravelItem.travel_litre_cost).toBe(450);
    expect(budgetResult.travel_total).toBe(6300);

    // Check the new food item
    const newFoodItem = budgetResult.food[budgetResult.food.length - 1];
    expect(newFoodItem.food_day).toBe('Sunday');
    expect(newFoodItem.food_cost).toBe(15000);
    expect(budgetResult.food_total).toBe(45000);
  });

  test('POST /post/budget/post - should return 400 if user sends data with empty string', async () => {
    await testUser.save();
    await testBudget.save();

    const body = {
      type: 'cast',
      first: '',
      second: '',
      third: '',
    };

    await request.post('/api/budget/post').send(body).set('Authorization', token).expect(400, 'You need to fill out all input field!');
  });

  test('POST /post/budget/post - should return 404 if user has no team', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
    });

    // Creating Test Budget with wrong google id in Database
    testBudget = new Budget({
      calendar_id: '123456789@group.calendar.google.com',
      google_id: '123456789BADID',
    });

    await testUser.save();
    await testBudget.save();

    const body = {
      type: 'cast',
      first: '',
      second: '',
      third: '',
    };

    await request.post('/api/budget/post').send(body).set('Authorization', token).expect(404, 'You need to create a team first!');
  });

  // ---------------- POST /api/budget/put ----------------
  test('POST /post/budget/put - should return 200 if updating a budget item works and database returns the updated values', async () => {
    await testUser.save();
    await testBudget.save();

    await Budget.findOne({ google_id: testUser.google_id }).then(async (budget) => {
      // Find the ID for the item, the user wants to update
      let castItemId = budget['cast'].map((cast) => cast._id);
      let rentItemId = budget['rent'].map((rent) => rent._id);
      let travelItemId = budget['travel'].map((travel) => travel._id);
      let foodItemId = budget['food'].map((food) => food._id);

      // Update cast item body with the correct object ID
      const castBody = {
        type: 'cast',
        objectId: castItemId[0],
        first: 'Actor',
        second: 'John Doe',
        third: 250000,
      };
      await request.post('/api/budget/put').send(castBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');

      // Update rent item body with the correct object ID
      const rentBody = {
        type: 'rent',
        objectId: rentItemId[0],
        first: 'House',
        second: 'Grand Hotel Paris',
        third: 330000,
      };
      await request.post('/api/budget/put').send(rentBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');

      // Update item body with the correct object ID
      const travelBody = {
        type: 'travel',
        objectId: travelItemId[0],
        first: 50,
        second: 7,
        third: 450,
      };
      await request.post('/api/budget/put').send(travelBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');

      // Update item body with the correct object ID
      const foodBody = {
        type: 'food',
        objectId: foodItemId[0],
        first: 'Saturday',
        second: 55000,
      };
      await request.post('/api/budget/put').send(foodBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');
    });

    // Check if the database updated the given budget item
    const newItem = await Budget.findOne({ google_id: testUser.google_id });

    // Returns the updated cast datas
    expect(newItem.cast[0].cast_role).toBe('Actor');
    expect(newItem.cast[0].cast_name).toBe('John Doe');
    expect(newItem.cast[0].cast_cost).toBe(250000);
    expect(newItem.cast.length).toBe(1);

    // Returns the updated rent datas
    expect(newItem.rent[0].rent_type).toBe('House');
    expect(newItem.rent[0].rent_name).toBe('Grand Hotel Paris');
    expect(newItem.rent[0].rent_cost).toBe(330000);
    expect(newItem.rent.length).toBe(1);

    // Returns the updated travel datas
    expect(newItem.travel[0].travel_distance).toBe(50);
    expect(newItem.travel[0].travel_car_cons).toBe(7);
    expect(newItem.travel[0].travel_litre_cost).toBe(450);
    expect(newItem.travel.length).toBe(2);

    // Returns the updated food datas
    expect(newItem.food[0].food_day).toBe('Saturday');
    expect(newItem.food[0].food_cost).toBe(55000);
    expect(newItem.food.length).toBe(1);
  });

  test('POST /post/budget/put - should return 404 if team is not found', async () => {
    await clearDatabase();

    testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
    });

    // Creating Test Budget with wrong google id in Database
    testBudget = new Budget({
      calendar_id: '123456789@group.calendar.google.com',
      google_id: '123456789BADID',
    });

    const body = {
      type: 'cast',
      objectId: '',
      first: '',
      second: '',
      third: 0,
    };

    await testUser.save();
    await testBudget.save();

    await request.post('/api/budget/put').send(body).set('Authorization', token).expect(404, 'Team not found!');
  });

  test('POST /post/budget/put - should return 200 if no items have been changed', async () => {
    await testUser.save();
    await testBudget.save();

    await Budget.findOne({ google_id: testUser.google_id }).then(async (budget) => {
      // Find the ID for the item, the user wants to update
      let testItemId = budget['food'].map((food) => food._id);

      // Update item body with the correct object ID
      const castBody = {
        type: 'cast',
        objectId: testItemId[0],
        first: '',
        second: '',
        third: '',
      };

      await request.post('/api/budget/put').send(castBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');

      const travelBody = {
        type: 'travel',
        objectId: testItemId[0],
        first: '',
        second: '',
        third: '',
      };

      await request.post('/api/budget/put').send(travelBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');
      const rentBody = {
        type: 'rent',
        objectId: testItemId[0],
        first: '',
        second: '',
        third: '',
      };

      await request.post('/api/budget/put').send(rentBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');

      const foodBody = {
        type: 'food',
        objectId: testItemId[0],
        first: '',
        second: '',
        third: '',
      };

      await request.post('/api/budget/put').send(foodBody).set('Authorization', token).expect(200, 'Successfully updated budget details!');
    });
  });

  // ---------------- POST /api/budget/delete ----------------
  test('POST /post/budget/delete - should return 200 if removing an item from budget database works', async () => {
    await testUser.save();
    await testBudget.save();

    await Budget.findOne({ google_id: testUser.google_id }).then(async (budget) => {
      // Find the ID for the item, the user wants to update
      let castItemId = budget['cast'].map((cast) => cast._id);
      let rentItemId = budget['rent'].map((rent) => rent._id);
      let travelItemId = budget['travel'].map((travel) => travel._id);
      let foodItemId = budget['food'].map((food) => food._id);

      // Choosen item body with the correct object ID
      const castBody = {
        type: 'cast',
        objectId: castItemId[0],
      };
      // Delete Cast Item
      await request.post('/api/budget/delete').send(castBody).set('Authorization', token).expect(200, 'Successfully deleted cast member!');

      const rentBody = {
        type: 'rent',
        objectId: rentItemId[0],
      };
      // Delete Rent Item
      await request.post('/api/budget/delete').send(rentBody).set('Authorization', token).expect(200, 'Successfully deleted cast member!');

      const travelFirstBody = {
        type: 'travel',
        objectId: travelItemId[0],
      };
      // Delete first Travel Item
      await request.post('/api/budget/delete').send(travelFirstBody).set('Authorization', token).expect(200, 'Successfully deleted cast member!');

      const travelSecondBody = {
        type: 'travel',
        objectId: travelItemId[1],
      };
      // Delete first Travel Item
      await request.post('/api/budget/delete').send(travelSecondBody).set('Authorization', token).expect(200, 'Successfully deleted cast member!');

      const foodBody = {
        type: 'food',
        objectId: foodItemId[0],
      };
      // Delete Food Item
      await request.post('/api/budget/delete').send(foodBody).set('Authorization', token).expect(200, 'Successfully deleted cast member!');
    });

    // Check if the database deleted the given budget item
    const deletedItem = await Budget.findOne({ google_id: testUser.google_id });

    expect(deletedItem.cast.length).toBe(0);
    expect(deletedItem.rent.length).toBe(0);
    expect(deletedItem.travel.length).toBe(0);
    expect(deletedItem.food.length).toBe(0);

    expect(deletedItem.cast_total).toBe(0);
    expect(deletedItem.rent_total).toBe(0);
    expect(deletedItem.travel_total).toBe(0);
    expect(deletedItem.food_total).toBe(0);
  });

  // ---------------- POST /api/budget/role ----------------
  test('POST /post/budget/role - should return 200 if user has a team', async () => {
    await testUser.save();
    await testBudget.save();

    await request.post('/api/budget/role').set('Authorization', token).expect(200, 'true');
  });

  test('POST /post/budget/role - should return 200 if user has a team', async () => {
    await testUser.save();
    await testBudget.save();

    await request.post('/api/budget/role').set('Authorization', token).expect(200, 'true');
  });

  test('POST /post/budget/role - should return 404 if user has no team and is not a leader', async () => {
    await clearDatabase();

    const testBudget = new Budget({
      calendar_id: '123456789BADID@group.calendar.google.com',
      google_id: '123456789',
    });

    await testUser.save();
    await testBudget.save();

    await request.post('/api/budget/role').set('Authorization', token).expect(404, 'You need to join a team first!');
  });

  test('POST /post/budget/role - should return 404 if user has no team and is a leader', async () => {
    await clearDatabase();

    const testUser = new User({
      google_id: '123456789',
      name: 'Brad Pitt',
      email: 'bradpitt@gmail.com',
      picture: 'bradpitt.jpg',
      roles: {
        team_leader: true,
      },
      team: {
        calendar_id: '123456789@group.calendar.google.com',
      },
    });

    const testBudget = new Budget({
      calendar_id: '123456789BADID@group.calendar.google.com',
      google_id: '123456789',
    });

    await testUser.save();
    await testBudget.save();

    await request.post('/api/budget/role').set('Authorization', token).expect(404, 'You need to create a team first!');
  });
});
