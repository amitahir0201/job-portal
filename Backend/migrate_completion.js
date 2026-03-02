const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');
const Company = require('./src/models/Company');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users to update.`);
    for (const user of users) {
      // Trigger pre-save hook
      await user.save();
      console.log(`Updated user ${user.fullName} (${user.email}): ${user.profileCompletionPercentage}%`);
    }

    const companies = await Company.find({});
    console.log(`Found ${companies.length} companies to update.`);
    for (const company of companies) {
      // Trigger pre-save hook
      await company.save();
      console.log(`Updated company ${company.companyName}: ${company.profileCompletionPercentage}%`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
