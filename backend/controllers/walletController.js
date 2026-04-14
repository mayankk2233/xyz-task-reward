const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Deposit = require('../models/Deposit');

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

// @desc    Request a deposit (Recharge)
// @route   POST /api/wallet/deposit
// @access  Private
const requestDeposit = async (req, res) => {
  const { amount, utrNumber } = req.body;
  const userId = req.user._id;

  try {
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
    if (!utrNumber || utrNumber.length < 8) return res.status(400).json({ success: false, message: 'Valid UTR/Transaction ID is required' });

    const exists = await Deposit.findOne({ utrNumber });
    if (exists) return res.status(400).json({ success: false, message: 'This UTR has already been submitted.' });

    const deposit = await Deposit.create({ user: userId, amount, utrNumber });

    await Transaction.create({
      user: userId,
      amount: amount,
      type: 'earn', 
      description: `Deposit request (Pending) - UTR: ${utrNumber}`,
      relatedId: deposit._id
    });

    res.status(201).json({ success: true, message: 'Deposit submitted for verification', data: deposit });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = {
  getHistory,
  requestWithdrawal,
  requestDeposit
};
