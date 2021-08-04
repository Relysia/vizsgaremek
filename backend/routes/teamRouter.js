const express = require('express');
const router = express.Router();
const { createCalendar } = require('../controllers/calendar/createCalendarController');
const { userTeam } = require('../controllers/team/userTeamController');
const { getTeam } = require('../controllers/team/getTeamController');
const { joinTeam } = require('../controllers/team/joinTeamController');

router.get('/', (req, res) => {
  res.send('Teams route is working!');
});

router.get('/getteam', getTeam);
router.post('/create', createCalendar);
router.post('/userteam', userTeam);
router.post('/jointeam', joinTeam);

module.exports = router;
