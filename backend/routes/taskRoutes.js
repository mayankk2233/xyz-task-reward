const express = require('express');
const router = express.Router();
const { getTasks, completeTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getTasks);
router.route('/:id/complete').post(protect, completeTask);

module.exports = router;
