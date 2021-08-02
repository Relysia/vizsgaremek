const Budget = require('../models/budget');
const jwt_decode = require('jwt-decode');

exports.getBudget = async (req, res) => {
  const { jwt, type } = req.body;
  const { google_id } = jwt_decode(jwt);
  const budget = await Budget.findOne({ google_id });

  res.send(budget[type]);
};
