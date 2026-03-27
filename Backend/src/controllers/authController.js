const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, fullName, email, password, companyName } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const resolvedName = String(fullName || name || '').trim();

    if (!resolvedName || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a JWT with user data
    const payload = {
      fullName: resolvedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'jobseeker',
      companyName,
    };
    
    // Sign the token with a 24-hour expiration
    const rawToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Build verify URL using raw token (frontend will call backend with this)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify-email/${rawToken}`;

    // Return raw token and user info (do NOT auto-login yet)
    res.status(201).json({
      success: true,
      pendingVerification: true,
      verifyUrl,          // frontend uses this to build EmailJS link
      rawToken,           // also returned so frontend can use directly
      user: {
        fullName: resolvedName,
        email: normalizedEmail,
        role: 'jobseeker',
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= VERIFY EMAIL ================= */
exports.verifyEmail = async (req, res) => {
  try {
    const rawToken = req.params.token;
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ success: false, message: 'Verification link is invalid or has expired.' });
    }

    const { fullName, email, password, role, companyName } = decoded;

    // Verify user doesn't already exist (in case they verified twice or registered again)
    const normalizedEmail = String(email).trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
       // If user already exists, check if they are verified
       if (user.isEmailVerified) {
         return res.status(400).json({ success: false, message: 'Email already verified. Please login.' });
       }
       // If they exist but aren't verified, we can update them and mark them verified.
       // However, in the new flow, they shouldn't exist unless created before this change.
       user.isEmailVerified = true;
       await user.save();
    } else {
       // Create the new user
       user = await User.create({
         fullName,
         email: normalizedEmail,
         password, // already hashed
         role,
         companyName,
         isEmailVerified: true,
       });
    }

    // Generate JWT so user is automatically logged in
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error('Email Verification Error:', error);
    res.status(500).json({ success: false, message: 'Error verifying email' });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing email or password' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Block login if email is not verified (only for jobseekers/seekers)
    const requiresVerification = ['jobseeker', 'seeker'].includes(user.role);
    if (requiresVerification && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        emailNotVerified: true,
        email: user.email,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashed,
          resetPasswordExpires: Date.now() + 15 * 60 * 1000
        }
      }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    return res.json({ success: true, name: user.fullName, resetUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing forgot password' });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const rawToken = req.params.token;
    const { password } = req.body || {};

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password too short' });
    }

    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalid or expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};

/* ================= GET PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, profile: user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};