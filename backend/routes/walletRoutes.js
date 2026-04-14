const express = require('express');
const router = express.Router();
const { getHistory, requestWithdrawal, requestDeposit } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

router.route('/history').get(protect, getHistory);
router.route('/withdraw').post(protect, requestWithdrawal);
router.route('/deposit').post(protect, requestDeposit);

module.exports = router;
