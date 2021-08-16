const axios = require('axios');
const jwt_decode = require('jwt-decode');
const { createTeam } = require('../../services/createTeam');

exports.createCalendar = async (req, res) => {
  const jwt = req.headers.authorization;
  const { title, joinPublic, budgetPublic, teamRole } = req.body;
  const { google_id, access_token } = jwt_decode(jwt);

  if (!title) {
    return res.status(400).send('Title is required!');
  }

  if (!teamRole) {
    return res.status(400).send('Team role is required!');
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars`;

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const body = {
    summary: `Filmsquad - ${title}`,
  };

  axios
    .post(url, body, config)
    .then((data) => {
      createTeam(data.data, res, google_id, title, joinPublic, budgetPublic, teamRole);
    })
    .catch((err) => {
      console.log(err.response);
    });
};
