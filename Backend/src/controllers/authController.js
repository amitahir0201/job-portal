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

  const user = await User.create({
    fullName: resolvedName,
    email: normalizedEmail,
    password,
    role: 'seeker',
    companyName,
  });

  const token = generateToken(user);

  res.json({
    success: true,
    user: {
      id: user._id,
      fullName: user.fullName,
      name: user.fullName,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
    },
    token,
  });
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Always return success (security best practice)
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account exists, a reset link has been sent.'
    });
  }

  // Generate reset token
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  // Save hashed token + expiry (15 min)
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        resetPasswordToken: hashed,
        resetPasswordExpires: Date.now() + 15 * 60 * 1000
      }
    }
  );

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  return res.json({
    success: true,
    name: user.fullName,
    resetUrl,
  });
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  const rawToken = req.params.token;
  const { password } = req.body || {};

  if (!rawToken) {
    return res.status(400).json({ success: false, message: 'Invalid token' });
  }

  if (!password || String(password).length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Token is invalid or has expired'
    });
  }

  user.password = password; // hashed by pre-save hook
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save({ validateBeforeSave: false });

  return res.json({
    success: true,
    message: 'Password has been reset successfully'
  });
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing email or password' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const ok = await user.matchPassword(password);
  if (!ok) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    user: {
      id: user._id,
      fullName: user.fullName,
      name: user.fullName,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
    },
    token,
  });
};

/* ================= GET PROFILE ================= */
exports.getProfile = async (req, res) => {
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, profile: user });

  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};