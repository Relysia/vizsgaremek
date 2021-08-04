const User = require('../../models/user');
const Team = require('../../models/team');
const jwt_decode = require('jwt-decode');
const axios = require('axios');

exports.newEvent = async (req, res) => {
  const { jwt, title, location, description, startDate, startTime, endDate, endTime } = req.body;
  const { google_id, access_token } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const team = await Team.findOne({ calendar_id });

  const members = [];

  team.members.forEach((member) => {
    members.push({ email: member.email });
  });

  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`;

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const body = {
    summary: title,
    location,
    description,
    attendees: members,
    start: {
      dateTime: `${startDate}T${startTime}:00+02:00`,
      timeZone: 'Europe/Budapest',
    },
    end: {
      dateTime: `${endDate}T${endTime}:00+02:00`,
      timeZone: 'Europe/Budapest',
    },
  };

  axios
    .post(url, body, config)
    .then((res) => {
      console.log(res.data);
      res.send(res.data);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
