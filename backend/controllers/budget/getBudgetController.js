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

  res.send(budget[type]);
};
