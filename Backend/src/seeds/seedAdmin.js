const User = require('../models/User');

async function seedAdmin() {
  try {
    // 1. Pull strictly from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'System Admin';

    // 2. Safety check: Exit if credentials aren't provided in .env
    if (!adminEmail || !adminPassword) {
      console.error('❌ Error: ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables.');
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      await User.deleteOne({ email: adminEmail });
      console.log(`⚠️  Old admin user deleted. Re-creating...`);
    }

    const adminUser = await User.create({
      fullName: adminName,
      email: adminEmail,
      password: adminPassword, // Hashing handled by your Model pre-save hook
      role: 'admin',
    });

    console.log(`✓ Admin user created successfully!`);
    console.log(`   Email: ${adminEmail}`);

    return adminUser;
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    throw error;
  }
}

module.exports = seedAdmin;