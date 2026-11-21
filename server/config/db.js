const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('👉 Make sure you have whitelisted 0.0.0.0/0 in MongoDB Atlas Network Access!');
    // In production, keep retrying in background rather than crash-looping immediately
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;
