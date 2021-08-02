const express = require('express');
const router = express.Router();
const { getBudget } = require('../controllers/getBudgetController');
const { postBudget } = require('../controllers/postBudgetController');
const { updateBudget } = require('../controllers/updateBudgetController');
const { deleteBudget } = require('../controllers/deleteBudgetController');

// GET BUDGET ITEM
router.post('/get', getBudget);
// POST BUDGET ITEM
router.post('/post', postBudget);
// DELETE BUDGET ITEM
router.post('/put', updateBudget);
// DELETE BUDGET ITEM
router.post('/delete', deleteBudget);

module.exports = router;
