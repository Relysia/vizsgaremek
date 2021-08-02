const Budget = require('../models/budget');
const jwt_decode = require('jwt-decode');

exports.postBudget = async (req, res) => {
  const { jwt, type, first, second, third } = req.body;
  const { google_id } = jwt_decode(jwt);
  const budget = await Budget.findOne({ google_id });

  if (!budget) {
    res.status(400).send('User not found!');
  }

  if (first === '' || second === '') {
    res.status(400).send('You need to fill out all input field!');
  }

  if (type === 'cast') {
    await budget[type].push({ cast_role: first, cast_name: second, cast_cost: third });
  }
  if (type === 'rent') {
    await budget[type].push({ rent_type: first, rent_name: second, rent_cost: third });
  }
  if (type === 'travel') {
    await budget[type].push({ travel_distance: first, travel_car_cons: second, travel_litre_cost: third });
  }
  if (type === 'food') {
    await budget[type].push({ food_day: first, food_cost: second });
  }

  await budget.save();

  res.json('Successfully added new cast member!');
};
