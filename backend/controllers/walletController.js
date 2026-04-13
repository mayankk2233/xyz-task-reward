const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// @desc    Get user's transaction history
// @route   GET /api/wallet/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    const withdrawals = await Withdrawal.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        withdrawals,
        balance: req.user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request a withdrawal
// @route   POST /api/wallet/withdraw
// @access  Private
const requestWithdrawal = async (req, res) => {
  const { amount, paymentDetails } = req.body;
  const userId = req.user._id;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (!paymentDetails) {
      return res.status(400).json({ success: false, message: 'Payment details are required' });
    }

    const user = await User.findById(userId);

    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Deduct balance
    user.balance -= amount;
    await user.save();

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      user: userId,
      amount,
      paymentDetails
    });

    // Create transaction log
    await Transaction.create({
      user: userId,
      amount: -amount,
      type: 'withdraw',
      description: `Withdrawal request (Pending)`,
      relatedId: withdrawal._id
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal requested successfully',
      data: withdrawal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHistory,
  requestWithdrawal
};
