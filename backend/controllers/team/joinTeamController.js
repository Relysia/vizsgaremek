const User = require('../../models/user');
const Team = require('../../models/team');
const jwt_decode = require('jwt-decode');
const axios = require('axios');

exports.joinTeam = async (req, res) => {
  const jwt = req.headers.authorization;
  const { calendar_id, role } = req.body;
  const { google_id, access_token } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  await Team.findOne({ calendar_id })
    .then(async (team) => {
      user.team.calendar_id = team.calendar_id;
      user.team.team_title = team.title;

      await user.save();

      team.members.push({ google_id: user.google_id, name: user.name, email: user.email, picture: user.picture, role });

      await team.save();

      const url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';

      const body = {
        id: team.calendar_id,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      axios
        .post(url, body, config)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      res.send('Successfully joined team!');
    })
    .catch((err) => console.log(err));
};
