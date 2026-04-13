const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  reward: { type: Number, required: true, min: 1 },
  link: { type: String, required: true },
  maxCompletions: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  completedBy: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    completedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
