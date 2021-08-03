const User = require('../models/user');
const Team = require('../models/team');
const jwt_decode = require('jwt-decode');

exports.userTeam = async (req, res) => {
  const jwt = req.body.jwt;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const team = await Team.findOne({ calendar_id });

  const title = team.title;

  const { name, picture, role } = team.leader;
  const leader = { name, picture, role };

  const members = team.members;
  // team.leader.google_id = undefined;

  res.send({ title, leader, members });
};
