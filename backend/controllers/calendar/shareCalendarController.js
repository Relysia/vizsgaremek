const User = require('../../models/user');
const Team = require('../../models/team');
const jwt_decode = require('jwt-decode');
const axios = require('axios');

exports.shareCalendar = async (req, res) => {
  const jwt = req.headers.authorization;
  const { email } = req.body;
  const { google_id, access_token } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/acl`;

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const body = {
    role: 'reader',
    scope: {
      type: 'user',
      value: email,
    },
  };

  axios
    .post(url, body, config)
    .then(async (response) => {
      await Team.findOne({ calendar_id }).then(async (team) => {
        const filterMember = team.members.filter((member) => member.email === email);
        filterMember[0].calendar_share = true;

        await team.save();
      });

      res.send('Successfully shared!');
    })
    .catch((err) => {
      res.status(400).send('Error sharing calendar!');
    });
};
