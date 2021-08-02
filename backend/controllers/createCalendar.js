const axios = require('axios');
const jwt_decode = require('jwt-decode');
const { createTeam } = require('../services/createTeam');

exports.createCalendar = async (req, res) => {
  const { jwt, title, publicValue } = req.body;
  const { google_id, access_token } = jwt_decode(jwt);

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
      createTeam(data.data, res, google_id, title, publicValue);
    })
    .catch((err) => {
      console.log(err.response);
    });
};
