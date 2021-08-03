const User = require('../models/user');
const Team = require('../models/team');
const jwt_decode = require('jwt-decode');

exports.joinTeam = async (req, res) => {
  const { jwt, calendar_id, role } = req.body;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  await Team.findOne({ calendar_id })
    .then(async (team) => {
      user.team.calendar_id = team.calendar_id;
      user.team.team_title = team.title;

      await user.save();

      team.members.push({ google_id: user.google_id, name: user.name, picture: user.picture, role });

      await team.save();

      res.send('Successfully joined team!');
    })
    .catch((err) => console.log(err));
};
