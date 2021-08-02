const express = require('express');
const router = express.Router();
const { createCalendar } = require('../controllers/createCalendar');

router.post('/create', createCalendar);

module.exports = router;
