const express = require('express');
const router = express.Router();
const { register } = require('../controllers/auth/registerController');
const { login } = require('../controllers/auth/loginController');
const { confirm } = require('../controllers/auth/confirmController');
const { getUser } = require('../controllers/user/getUserController');
const { getRoles } = require('../controllers/auth/getRolesController');
const { setRole } = require('../controllers/auth/setRoleController');
const userAuthHandler = require('../middleware/userAuthHandler');

router.get('/', (req, res) => {
  res.send('Api Router is Working!');
});

// Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/confirm', confirm);

// User requests
router.post('/user', getUser);

// Get User Role
router.post('/getroles', userAuthHandler, getRoles);

// Set User Role
router.post('/role', setRole);

module.exports = router;
