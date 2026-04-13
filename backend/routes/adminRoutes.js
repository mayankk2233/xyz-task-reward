const express = require('express');
const router = express.Router();
const { getAllUsers, getAllTasks, createTask, updateTask, getAllWithdrawals, processWithdrawal } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.route('/users').get(getAllUsers);
router.route('/tasks').get(getAllTasks).post(createTask);
router.route('/tasks/:id').put(updateTask);
router.route('/withdrawals').get(getAllWithdrawals);
router.route('/withdrawals/:id').put(processWithdrawal);

module.exports = router;
