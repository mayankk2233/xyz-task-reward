const express = require('express');
const router = express.Router();
const { getGameRules, getHistory, placeBet, claimRewards } = require('../controllers/colorGameController');
const { protect } = require('../middleware/auth');

router.get('/status', protect, getGameRules);
router.get('/history', protect, getHistory);
router.post('/bet', protect, placeBet);
router.post('/claim', protect, claimRewards);

module.exports = router;
