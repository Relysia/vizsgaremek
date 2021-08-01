const express = require('express');
const router = express.Router();
const { register } = require('../controllers/registerController');
const { login } = require('../controllers/loginController');
const { confirm } = require('../controllers/confirmController');
const { getUser } = require('../controllers/getUserController');

// Authentication
router.get('/', (req, res) => {
  res.send('Hello');
});
router.post('/register', register);
router.post('/login', login);
router.get('/confirm', confirm);

// User requests
router.get('/user', getUser);

module.exports = router;
