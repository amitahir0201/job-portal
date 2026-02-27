const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGO_URI not provided');
  await mongoose.connect(mongoUri, {
    // options are automatically handled in mongoose >=6
  });
  console.log('Connected to MongoDB');
};

module.exports = connectDB;
