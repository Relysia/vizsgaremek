const User = require('../../models/user');
const jwt_decode = require('jwt-decode');

const teamAuth = async (req, res) => {
  const jwt = req.headers.authorization;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  if (!calendar_id) {
    if (user.roles.team_leader) {
      return res.status(404).send('You need to create a team first!');
    } else {
      return res.status(404).send('You need to join a team first!');
    }
  }

  return res.status(200).send('Success!');
};

module.exports = teamAuth;
