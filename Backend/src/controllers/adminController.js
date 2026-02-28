const crypto = require('crypto');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../services/mailer');

/**
 * Create a new recruiter account
 * Only accessible by admin users
 * Recruiter receives password reset email and must set password before login
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
    // Generate a random temporary password (not actually used, just for completeness)
    const temporaryPassword = crypto.randomBytes(8).toString('hex');

    // Create recruiter user with temp password
    const recruiter = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: temporaryPassword,
      role: 'recruiter',
      companyName: companyName ? companyName.trim() : null,
    });

    // Generate reset token for recruiter to set their password
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save reset token with 24-hour expiry
    await User.updateOne(
      { _id: recruiter._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        },
      }
    );

    // Send password reset email
    try {
      console.log(`[Admin] Sending recruiter invitation email to: ${recruiter.email}`);
      const emailInfo = await sendResetPasswordEmail({
        to: recruiter.email,
        name: recruiter.fullName,
        token: resetToken,
      });
      console.log(
        `[Admin] Recruiter invitation email sent successfully. Message ID: ${emailInfo.messageId}`
      );
    } catch (emailError) {
      console.error('[Admin] Error sending recruiter invitation email:', emailError.message);
      // Continue even if email fails - recruiter still created
    }

    return res.status(201).json({
      success: true,
      message: 'Recruiter invited successfully. Password reset email sent.',
      recruiter: {
        id: recruiter._id,
        fullName: recruiter.fullName,
        email: recruiter.email,
        role: recruiter.role,
        companyName: recruiter.companyName,
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
    const seekerUsers = await User.countDocuments({ role: 'seeker' });

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
