const express = require('express');
const router = express.Router();
const summary = require('../controllers/summary/summaryController');

router.post('/', summary);

module.exports = router;
