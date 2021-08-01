const User = require('../models/user');
const jwt_decode = require('jwt-decode');

exports.getBudget = async (req, res) => {
  const jwt = req.query.jwt;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  res.send(user.budget);
};
