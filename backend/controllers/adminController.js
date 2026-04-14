const User = require('../models/User');
const Task = require('../models/Task');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const Deposit = require('../models/Deposit');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/admin/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, reward, link, maxCompletions, status } = req.body;

    const task = await Task.create({
      title,
      description,
      reward,
      link,
      maxCompletions: maxCompletions || 0,
      status: status || 'active',
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/admin/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all withdrawals
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({})
      .populate('user', 'username email balance')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process a withdrawal
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
const processWithdrawal = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal is already processed' });
    }

    // Update status
    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    withdrawal.processedBy = req.user._id;
    withdrawal.processedAt = Date.now();
    await withdrawal.save();

    // If rejected, refund user
    if (status === 'rejected') {
      const user = await User.findById(withdrawal.user);
      user.balance += withdrawal.amount;
      await user.save();

      // Create transaction for refund
      await Transaction.create({
        user: user._id,
        amount: withdrawal.amount,
        type: 'earn',
        description: `Refund for rejected withdrawal`,
        relatedId: withdrawal._id
      });
    }

    res.status(200).json({ success: true, data: withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all deposits
// @route   GET /api/admin/deposits
// @access  Private/Admin
const getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({}).populate('user', 'username email balance').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: deposits });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// @desc    Process a deposit
// @route   PUT /api/admin/deposits/:id
// @access  Private/Admin
const processDeposit = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ success: false, message: 'Deposit not found' });
    if (deposit.status !== 'pending') return res.status(400).json({ success: false, message: 'Deposit is already processed' });

    deposit.status = status;
    await deposit.save();

    if (status === 'approved') {
      const user = await User.findById(deposit.user);
      user.balance += deposit.amount;
      await user.save();

      await Transaction.create({
        user: user._id,
        amount: deposit.amount,
        type: 'earn',
        description: `Deposit Approved - UTR: ${deposit.utrNumber}`,
        relatedId: deposit._id
      });
    }

    res.status(200).json({ success: true, data: deposit });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = {
  getAllUsers,
  getAllTasks,
  createTask,
  updateTask,
  getAllWithdrawals,
  processWithdrawal,
  getAllDeposits,
  processDeposit
};
