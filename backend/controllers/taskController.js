const Task = require('../models/Task');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all active tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'active' }).sort({ createdAt: -1 });
    
    // Check which tasks the user has completed
    const tasksWithCompletionStatus = tasks.map(task => {
      const isCompleted = task.completedBy.some(
        completion => completion.user.toString() === req.user._id.toString()
      );
      
      const isFull = task.maxCompletions > 0 && task.completedBy.length >= task.maxCompletions;
      
      return {
        _id: task._id,
        title: task.title,
        description: task.description,
        reward: task.reward,
        link: task.link,
        maxCompletions: task.maxCompletions,
        currentCompletions: task.completedBy.length,
        isCompleted,
        isFull
      };
    });

    res.status(200).json({ success: true, data: tasksWithCompletionStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a task
// @route   POST /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Task is no longer active' });
    }

    if (task.maxCompletions > 0 && task.completedBy.length >= task.maxCompletions) {
      return res.status(400).json({ success: false, message: 'Task has reached maximum completions' });
    }

    const alreadyCompleted = task.completedBy.some(
      completion => completion.user.toString() === userId.toString()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ success: false, message: 'You have already completed this task' });
    }

    // Mark as completed
    task.completedBy.push({ user: userId });
    await task.save();

    // Reward user
    const user = await User.findById(userId);
    user.balance += task.reward;
    await user.save();

    // Create transaction log
    await Transaction.create({
      user: userId,
      amount: task.reward,
      type: 'earn',
      description: `Reward for completing task: ${task.title}`,
      relatedId: task._id
    });

    res.status(200).json({ success: true, message: 'Task completed successfully', reward: task.reward });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  completeTask
};
