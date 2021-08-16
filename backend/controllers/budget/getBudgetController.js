const Budget = require('../../models/budget');
const User = require('../../models/user');
const jwt_decode = require('jwt-decode');

exports.getBudget = async (req, res) => {
  const jwt = req.headers.authorization;
  const { type } = req.body;
  const { google_id } = jwt_decode(jwt);

  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const budget = await Budget.findOne({ calendar_id });

  let total;

  if (type === 'cast') {
    total = budget.cast_total;
  }
  if (type === 'rent') {
    total = budget.rent_total;
  }
  if (type === 'travel') {
    total = budget.travel_total;
  }
  if (type === 'food') {
    total = budget.food_total;
  }

  res.send({ budget: budget[type], total });
};
