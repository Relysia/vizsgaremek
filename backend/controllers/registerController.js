const { googleAuth } = require('../services/googleAuth');
const { createUser } = require('../services/createUser');

exports.register = (req, res) => {
  const redirect = process.env.REDIRECT_REGURI;

  googleAuth(req, res, redirect, createUser);
};
