const { authUser } = require('../services/authUser');
const { googleAuth } = require('../services/googleAuth');

exports.login = (req, res) => {
  const redirect = process.env.REDIRECT_AUTHURI;

  googleAuth(req, res, redirect, authUser);
};
