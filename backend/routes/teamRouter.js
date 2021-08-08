const express = require('express');
const router = express.Router();
const { createCalendar } = require('../controllers/calendar/createCalendarController');
const userTeam = require('../controllers/team/userTeamController');
const getTeam = require('../controllers/team/getTeamController');
const { joinTeam } = require('../controllers/team/joinTeamController');
const userAuthHandler = require('../middleware/userAuthHandler');

router.get('/', (req, res) => {
  res.send('Teams route is working!');
});

router.get('/getteam', userAuthHandler, getTeam);
router.post('/create', userAuthHandler, createCalendar);
router.post('/userteam', userAuthHandler, userTeam);
router.post('/jointeam', joinTeam);

module.exports = router;
