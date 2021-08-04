const express = require('express');
const router = express.Router();
const { newEvent } = require('../controllers/calendar/newEventController');
const { shareCalendar } = require('../controllers/calendar/shareCalendarController');

router.get('/', (req, res) => {
  res.send('Calendar route is working!');
});

router.post('/sharecalendar', shareCalendar);
router.post('/newevent', newEvent);

module.exports = router;
