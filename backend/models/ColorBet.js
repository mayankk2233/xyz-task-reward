const mongoose = require('mongoose');

const colorBetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  roundId: { type: Number, required: true },
  amount: { type: Number, required: true, min: 1 },
  prediction: { type: String, enum: ['red', 'green', 'violet'], required: true },
  isClaimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ColorBet', colorBetSchema);
