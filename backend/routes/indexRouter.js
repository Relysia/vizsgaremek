const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Backend is working!');
});

router.get('/preview', (req, res) => {
  res.render('confirm', { name: 'Riki Baranyai' });
});

module.exports = router;
