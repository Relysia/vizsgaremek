const { authUser } = require('../../services/authUser');
const { googleAuth } = require('../../services/googleAuth');

exports.login = (req, res) => {
  const redirect = `${process.env.FRONTEND_HOST}/login`;

  googleAuth(req, res, redirect, authUser);
};
