const crypto = require('crypto');
const User = require('../models/User');

/**
 * Create a new recruiter account
 * Only accessible by admin users
 * Returns reset URL that frontend can use to send invitation via EmailJS
 */
exports.createRecruiter = async (req, res) => {
  const { fullName, email, companyName } = req.body;

  // Validate required fields
  if (!fullName || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required',
    });
  }

  // Normalize email
  const normalizedEmail = String(email).trim().toLowerCase();

  // Check if user already exists
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered',
    });
  }

  try {
    // Generate a random temporary password
    const temporaryPassword = crypto.randomBytes(8).toString('hex');

    // Create recruiter user with temp password
    const recruiter = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: temporaryPassword,
      role: 'recruiter',
      companyName: companyName ? companyName.trim() : null,
    });

    console.log(`[Admin] Created recruiter account: ${recruiter.email}`);

    // Generate reset token for recruiter to set their password
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save reset token with 24-hour expiry
    recruiter.resetPasswordToken = hashedToken;
    recruiter.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await recruiter.save({ validateBeforeSave: false });

    console.log(`[Admin] Generated reset token for recruiter: ${recruiter.email}`);

    // Build the reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Return recruiter info and reset URL
    // Frontend will use this to send invitation email via EmailJS
    return res.status(201).json({
      success: true,
      message: 'Recruiter created successfully. Send invitation email using the data below.',
      recruiter: {
        id: recruiter._id,
        fullName: recruiter.fullName,
        email: recruiter.email,
        role: recruiter.role,
        companyName: recruiter.companyName,
      },
      // 👇 Frontend will use these to send email via EmailJS
      emailData: {
        to_email: recruiter.email,
        user_name: recruiter.fullName,
        reset_link: resetUrl,
      },
    });
  } catch (error) {
    console.error('[Admin] Error creating recruiter:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create recruiter account',
    });
  }
};

/**
 * List all recruiters (admin only)
 */
exports.listRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select(
      '-password -resetPasswordToken -resetPasswordExpires'
    );

    return res.json({
      success: true,
      count: recruiters.length,
      recruiters,
    });
  } catch (error) {
    console.error('[Admin] Error listing recruiters:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recruiters',
    });
  }
};

/**
 * Get admin dashboard stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const recruiterUsers = await User.countDocuments({ role: 'recruiter' });
    const seekerUsers = await User.countDocuments({ role: 'jobseeker' });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        recruiterUsers,
        seekerUsers,
      },
    });
  } catch (error) {
    console.error('[Admin] Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
};

/**
 * Delete a recruiter account
 * Only accessible by admin users
 */
exports.deleteRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    if (!recruiterId) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter ID is required',
      });
    }

    // Find the recruiter
    const recruiter = await User.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found',
      });
    }

    // Verify it's actually a recruiter
    if (recruiter.role !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: 'Can only delete users with recruiter role',
      });
    }

    // Delete the recruiter
    await User.findByIdAndDelete(recruiterId);

    console.log(`[Admin] Deleted recruiter account: ${recruiter.email}`);

    return res.json({
      success: true,
      message: `Recruiter ${recruiter.fullName} has been deleted successfully`,
      recruiter: {
        id: recruiter._id,
        fullName: recruiter.fullName,
        email: recruiter.email,
      },
    });
  } catch (error) {
    console.error('[Admin] Error deleting recruiter:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete recruiter',
    });
  }
};
