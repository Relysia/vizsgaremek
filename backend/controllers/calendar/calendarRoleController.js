const User = require('../../models/user');
const Team = require('../../models/team');
const jwt_decode = require('jwt-decode');
const axios = require('axios');

exports.calendarRole = async (req, res) => {
  const jwt = req.headers.authorization;
  const { email } = req.body;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  if (!user) {
    res.status(404).send('User not exists!');
  }

  await Team.findOne({ calendar_id }).then(async (team) => {
    const filterMember = team.members.filter((member) => member.email === email);

    const role = [];

    filterMember.forEach((member) => {
      role.push({ share: member.calendar_share, join: member.calendar_join });
    });

    res.send(role);
  });
};
