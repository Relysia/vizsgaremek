const express = require('express');
const router = express.Router();
const { createCalendar } = require('../controllers/createCalendar');
const { userTeam } = require('../controllers/userTeam');
const { getRoles } = require('../controllers/getRoles');
const { getTeam } = require('../controllers/getTeam');
const { joinTeam } = require('../controllers/joinTeam');

router.get('/', (req, res) => {
  res.send('Teams route working!');
});

router.get('/getteam', getTeam);
router.post('/getroles', getRoles);
router.post('/create', createCalendar);
router.post('/userteam', userTeam);
router.post('/jointeam', joinTeam);

module.exports = router;
