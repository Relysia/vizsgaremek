const axios = require('axios');

const googleAuth = (req, res, redirect, authType) => {
  const code = req.body.code;

  const url = 'https://oauth2.googleapis.com/token';

  const body = {
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: redirect,
    grant_type: 'authorization_code',
  };

  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios
    .post(url, body, config)
    .then((data) => {
      authType(data.data, res);
    })
    .catch((err) => res.status(400).send('Google Authentication error!'));
};

module.exports.googleAuth = googleAuth;
