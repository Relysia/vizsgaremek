const User = require('../../models/user');
const jwt_decode = require('jwt-decode');
const axios = require('axios');

exports.upcommingEvent = async (req, res) => {
  const jwt = req.headers.authorization;
  const { google_id, access_token } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`;

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  axios
    .get(url, config)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
};
