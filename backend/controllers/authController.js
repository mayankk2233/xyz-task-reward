const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, referralCode } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let referredByQuery = null;
    if (referralCode) {
      const parentUser = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (parentUser) referredByQuery = parentUser._id;
    }

    const user = await User.create({ username, email, password, referredBy: referredByQuery });

    if (user) {
      if (referredByQuery) {
        const parentUser = await User.findById(referredByQuery);
        parentUser.referredUsers.push(user._id);
        parentUser.balance += 50;
        await parentUser.save();
        await Transaction.create({ user: parentUser._id, amount: 50, type: 'referral_bonus', description: `Referral bonus for inviting ${user.username}`, relatedId: user._id });

        user.balance += 50;
        await user.save();
        await Transaction.create({ user: user._id, amount: 50, type: 'referral_bonus', description: `Welcome bonus for using referral code ${referralCode}`, relatedId: parentUser._id });
      }

      res.status(201).json({
        success: true,
        data: { _id: user._id, username: user.username, email: user.email, role: user.role, balance: user.balance, referralCode: user.referralCode, token: generateToken(user._id) }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (err) { next(err); }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: { _id: user._id, username: user.username, email: user.email, role: user.role, balance: user.balance, referralCode: user.referralCode, token: generateToken(user._id) }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('referredUsers', 'username createdAt');
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

module.exports = { registerUser, loginUser, getMe };
