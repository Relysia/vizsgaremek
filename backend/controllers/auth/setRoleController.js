const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

exports.setRole = async (req, res) => {
  const { token, role } = req.body;
  const { google_id, name, email, picture, firstTime, access_token } = jwt_decode(token);

  await User.findOne({ google_id })
    .then(async (user) => {
      if (role === 'leader') {
        user.roles.team_leader = true;
      }

      if (role === 'member') {
        user.roles.team_member = true;
      }

      user.firstTime = false;

      await user.save();

      const token = jwt.sign({ google_id, name, email, picture, firstTime: user.firstTime, access_token }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });

      return res.status(200).send(token);
    })
    .catch((err) => {
      console.log(err);
    });
};
