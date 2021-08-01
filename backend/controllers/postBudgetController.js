const User = require('../models/user');
const jwt_decode = require('jwt-decode');

exports.postBudget = async (req, res) => {
  const { jwt, type, first, second, third } = req.body;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  if (!user) {
    res.status(400).send('User not found!');
  }

  if (first === '' || second === '' || third === '') {
    res.status(400).send('You need to fill out all input field!');
  }

  if (type === 'cast') {
    await user.budget.cast.push({ cast_role: first, cast_name: second, cast_cost: third });
    await user.save();
    res.json('Successfully added new cast member!');
  }
};
