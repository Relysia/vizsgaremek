const express = require('express');
const router = express.Router();
const { getBudget } = require('../controllers/getBudgetController');
const { postBudget } = require('../controllers/postBudgetController');
const { updateBudget } = require('../controllers/updateBudgetController');
const { deleteBudget } = require('../controllers/deleteBudgetController');

// GET BUDGET ITEM
router.get('/', getBudget);
// POST BUDGET ITEM
router.post('/', postBudget);
// DELETE BUDGET ITEM
router.put('/', updateBudget);
// DELETE BUDGET ITEM
router.delete('/', deleteBudget);

module.exports = router;
