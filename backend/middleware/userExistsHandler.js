const User = require('../models/user');
const jwt_decode = require('jwt-decode');

const userAuthHandler = async (req, res, next) => {
  const jwt = req.headers.authorization;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  if (!user) {
    res.status(404).send('User not found. Please sign up!');
  } else {
    next();
  }
};

module.exports = userAuthHandler;
