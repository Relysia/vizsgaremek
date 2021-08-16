const express = require('express');
const router = express.Router();
const { newEvent } = require('../controllers/calendar/newEventController');
const { upcommingEvent } = require('../controllers/calendar/upcommingEventController');
const { shareCalendar } = require('../controllers/calendar/shareCalendarController');
const { addCalendar } = require('../controllers/calendar/addCalendarController');
const { calendarRole } = require('../controllers/calendar/calendarRoleController');

router.get('/', (req, res) => {
  res.send('Calendar route is working!');
});

router.post('/newevent', newEvent);
router.get('/getupcomming', upcommingEvent);
router.post('/sharecalendar', shareCalendar);
router.post('/addcalendar', addCalendar);
router.post('/calendarrole', calendarRole);

module.exports = router;
