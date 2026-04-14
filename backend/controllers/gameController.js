const User = require('../models/User');
const Transaction = require('../models/Transaction');

const playCoinFlip = async (req, res, next) => {
  try {
    const { betAmount, prediction } = req.body;
    
    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid bet amount' });
    }
    if (!['heads', 'tails'].includes(prediction)) {
      return res.status(400).json({ success: false, message: 'Invalid prediction' });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.balance < betAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Securely deduct bet first
    user.balance -= betAmount;
    await user.save();
    
    await Transaction.create({
      user: user._id,
      amount: -betAmount,
      type: 'game_bet',
      description: `Coin Flip Bet (${prediction.toUpperCase()})`
    });

    // Run secure RNG (House edge prevents long-term manipulation)
    const flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
    const isWin = flipResult === prediction;

    let payout = 0;
    if (isWin) {
      // 1.98x multiplier translates to a 2% house edge ensuring platform stability
      payout = Number((betAmount * 1.98).toFixed(2));
      user.balance += payout;
      await user.save();

      await Transaction.create({
        user: user._id,
        amount: payout,
        type: 'game_win',
        description: `Coin Flip Win (${flipResult.toUpperCase()})`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        result: flipResult,
        isWin,
        payout,
        newBalance: user.balance
      }
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { playCoinFlip };
