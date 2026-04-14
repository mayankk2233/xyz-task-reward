const express = require('express');
const router = express.Router();
const { playCoinFlip } = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

router.post('/coinflip', protect, playCoinFlip);

module.exports = router;
