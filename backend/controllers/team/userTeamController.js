const User = require('../../models/user');
const Team = require('../../models/team');
const jwt_decode = require('jwt-decode');

const userTeam = async (req, res) => {
  const jwt = req.headers.authorization;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const team = await Team.findOne({ calendar_id });

  if (!team) {
    return res.status(404).send('Team not found!');
  }

  const title = team.title;

  const { name, picture, role } = team.leader;
  const leader = { name, picture, role };

  const members = [];

  team.members.forEach((member) => {
    members.push({ name: member.name, email: member.email, picture: member.picture, role: member.role, share: member.calendar_share, join: member.calendar_join });
  });

  const public = team.public;

  res.send({ title, leader, members, public });
};

module.exports = userTeam;
