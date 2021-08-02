const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authUser = async (data, res) => {
  const { sub, name, email, picture } = jwt_decode(data.id_token);

  const access_token = data.access_token;

  const user = await User.findOne({ google_id: sub });

  if (!user) {
    return res.status(401).send('You need to sign up first!');
  }

  if (!user.isValid) {
    return res.status(401).send('You need to confirm your email address!');
  }

  const token = jwt.sign({ google_id: sub, name, email, picture, firstTime: user.firstTime, access_token }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });

  return res.status(200).send(token);
};
