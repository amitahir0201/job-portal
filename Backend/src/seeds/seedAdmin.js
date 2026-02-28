const User = require('../models/User');

/**
 * Seed admin user if not exists
 * Admin Credentials:
 * Email: 010tempt@gmail.com
 * Password: 010tempt
 * Role: admin
 */
async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || '010tempt@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '010tempt';
    const adminName = process.env.ADMIN_NAME || 'System Admin';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Delete the old admin (in case it was created with incorrect password hashing)
      await User.deleteOne({ email: adminEmail });
      console.log(`⚠️  Old admin user deleted. Creating new one...`);
    }

    // Create admin user with plain password
    // The User model pre-save hook will hash it automatically
    const adminUser = await User.create({
      fullName: adminName,
      email: adminEmail,
      password: adminPassword, // Plain password - will be hashed by pre-save hook
      role: 'admin',
    });

    console.log(`✓ Admin user created successfully!`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Role: admin`);
    console.log(`  Name: ${adminName}`);

    return adminUser;
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    throw error;
  }
}

module.exports = seedAdmin;
