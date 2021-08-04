const { googleAuth } = require('../../services/googleAuth');
const { createUser } = require('../../services/createUser');

exports.register = (req, res) => {
  const redirect = `${process.env.FRONTEND_HOST}/register`;

  googleAuth(req, res, redirect, createUser);
};
