const jwt = require('jsonwebtoken');

const userAuthHandler = (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET, (err, verified) => {
    if (err) {
      res.status(401).send('You need to login again!');
    } else {
      next();
    }
  });
};

module.exports = userAuthHandler;
