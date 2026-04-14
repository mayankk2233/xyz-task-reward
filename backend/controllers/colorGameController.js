const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ColorBet = require('../models/ColorBet');
const crypto = require('crypto');

// Deterministic Server-Sided Generator (Based on Round ID prevents hacking)
const getRoundResult = (roundId) => {
  const hash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret').update(roundId.toString()).digest('hex');
  const number = parseInt(hash.substring(0, 8), 16) % 10; // 0 to 9
  
  let color = 'green';
  if ([2, 4, 6, 8].includes(number)) color = 'red';
  if ([1, 3, 7, 9].includes(number)) color = 'green';
  if ([0, 5].includes(number)) color = 'violet'; // 0 is violet+red, 5 is violet+green in some apps, we keep it simple violet

  return { number, color };
};

const getGameRules = (req, res) => {
  const currentRoundId = Math.floor(Date.now() / 60000);
  const timeRemainingSeconds = 60 - Math.floor((Date.now() / 1000) % 60);
  res.json({ success: true, currentRoundId, timeRemainingSeconds });
};

const getHistory = (req, res) => {
  const currentRoundId = Math.floor(Date.now() / 60000);
  const history = [];
  for (let i = 1; i <= 10; i++) {
    const rId = currentRoundId - i;
    history.push({ roundId: rId, result: getRoundResult(rId) });
  }
  res.json({ success: true, data: history });
};

const placeBet = async (req, res, next) => {
  try {
    const { amount, prediction, roundId } = req.body;
    const currentRoundId = Math.floor(Date.now() / 60000);
    const timeRemainingSeconds = 60 - Math.floor((Date.now() / 1000) % 60);

    // Prevent betting in the last 10 seconds or on wrong rounds
    if (roundId !== currentRoundId) return res.status(400).json({ success: false, message: 'Invalid round ID' });
    if (timeRemainingSeconds <= 10) return res.status(400).json({ success: false, message: 'Betting is locked for this round!' });
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid bet amount' });
    if (!['red', 'green', 'violet'].includes(prediction)) return res.status(400).json({ success: false, message: 'Invalid color prediction' });

    const user = await User.findById(req.user._id);
    if (!user || user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });

    user.balance -= amount;
    await user.save();

    await Transaction.create({ user: user._id, amount: -amount, type: 'game_bet', description: `Color Wingo Bet (${prediction.toUpperCase()}) - Round ${roundId}` });

    const bet = await ColorBet.create({ user: user._id, roundId, amount, prediction });

    res.status(201).json({ success: true, newBalance: user.balance, bet });
  } catch (error) { next(error); }
};

const claimRewards = async (req, res, next) => {
  try {
    const currentRoundId = Math.floor(Date.now() / 60000);
    
    // Find all unclaimed bets from PREVIOUS rounds (meaning the result is generated)
    const unclaimedBets = await ColorBet.find({ user: req.user._id, isClaimed: false, roundId: { $lt: currentRoundId } });
    if (unclaimedBets.length === 0) return res.status(200).json({ success: true, message: 'No pending rewards to claim', totalPayout: 0 });

    let totalPayout = 0;
    const user = await User.findById(req.user._id);

    for (let bet of unclaimedBets) {
      const result = getRoundResult(bet.roundId);
      const isWin = bet.prediction === result.color;
      let payout = 0;

      if (isWin) {
        if (bet.prediction === 'violet') payout = Number((bet.amount * 4.5).toFixed(2)); // Violet high payout
        else payout = Number((bet.amount * 1.95).toFixed(2)); // Standard color payout (house edge ~ 5%)

        user.balance += payout;
        totalPayout += payout;
        
        await Transaction.create({ user: user._id, amount: payout, type: 'game_win', description: `Color Wingo Win (${bet.prediction.toUpperCase()}) - Round ${bet.roundId}` });
      }
      
      bet.isClaimed = true;
      await bet.save();
    }

    if (totalPayout > 0) await user.save();

    res.status(200).json({ success: true, totalPayout, newBalance: user.balance });
  } catch (error) { next(error); }
};

module.exports = { getGameRules, getHistory, placeBet, claimRewards };
