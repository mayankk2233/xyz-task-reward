const express = require('express');
const router = express.Router();
const { getHistory, requestWithdrawal } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

router.route('/history').get(protect, getHistory);
router.route('/withdraw').post(protect, requestWithdrawal);

module.exports = router;
