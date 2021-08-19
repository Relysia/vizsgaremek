const User = require('../../models/user');
const jwt_decode = require('jwt-decode');
const axios = require('axios');

exports.upcommingEvent = async (req, res) => {
  const jwt = req.headers.authorization;
  const { google_id, access_token } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?singleEvents=true&orderBy=startTime`;

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  axios
    .get(url, config)
    .then((response) => {
      const events = [];

      response.data.items.forEach((event) => {
        events.push({ summary: event.summary, start: { dateTime: event.start.dateTime }, end: { dateTime: event.end.dateTime }, htmlLink: event.htmlLink });
      });

      return res.send(events);
    })
    .catch((err) => {
      return res.status(400).send('Error getting calendar events!');
    });
};
