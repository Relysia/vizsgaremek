const express = require('express');
const router = express.Router();
const { getBudget } = require('../controllers/budget/getBudgetController');
const { postBudget } = require('../controllers/budget/postBudgetController');
const { updateBudget } = require('../controllers/budget/updateBudgetController');
const { deleteBudget } = require('../controllers/budget/deleteBudgetController');
const getBudgetRole = require('../controllers/budget/getBudgetRoleController');

// GET BUDGET ITEM
router.post('/get', getBudget);

// POST BUDGET ITEM
router.post('/post', postBudget);

// UPDATE BUDGET ITEM
router.post('/put', updateBudget);

// DELETE BUDGET ITEM
router.post('/delete', deleteBudget);

// GET BUDGET PUBLIC ROLE
router.post('/role', getBudgetRole);

module.exports = router;
