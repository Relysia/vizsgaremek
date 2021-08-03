const express = require('express');
const router = express.Router();
const { createCalendar } = require('../controllers/createCalendar');
const { userTeam } = require('../controllers/userTeam');
const { getRoles } = require('../controllers/getRoles');

router.post('/getroles', getRoles);
router.post('/create', createCalendar);
router.post('/userteam', userTeam);

module.exports = router;
