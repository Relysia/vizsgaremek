const User = require('../../models/user');
const jwt_decode = require('jwt-decode');

exports.getRoles = async (req, res) => {
  const jwt = req.body.jwt;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const leader = user.roles.team_leader;
  const calendar_id = user.team.calendar_id;

  res.send({ leader, calendar_id });
};
