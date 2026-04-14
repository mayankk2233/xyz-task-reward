const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany([
        { title: 'Join our VIP Telegram', description: 'Join our official Telegram channel for daily Wingo predictions and free signals!', reward: 150, link: 'https://t.me/placeholder', maxCompletions: 100000, isActive: true },
        { title: 'Subscribe to YouTube', description: 'Subscribe to our channel to watch live Wingo winning tricks.', reward: 200, link: 'https://youtube.com', maxCompletions: 50000, isActive: true },
        { title: 'Follow Instagram Page', description: 'Follow our daily meme page on Instagram.', reward: 50, link: 'https://instagram.com', maxCompletions: 50000, isActive: true },
        { title: 'Leave a 5-Star Review', description: 'Give us a 5-star review on the Google Play Store to get massive bonuses.', reward: 300, link: 'https://play.google.com', maxCompletions: 10000, isActive: true }
      ]);
      console.log('Successfully seeded 4 premium tasks into the live database!');
    } else {
       console.log('Tasks already exist, skipping seed.');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
seedTasks();
