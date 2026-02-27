const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

exports.register = async (req, res) => {
  const { name, fullName, email, password, role, companyName } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const resolvedName = String(fullName || name || '').trim();
  if (!resolvedName || !normalizedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ success: false, message: 'User already exists' });

  const user = await User.create({
    fullName: resolvedName,
    email: normalizedEmail,
    password,
    role,
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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Missing email or password' });

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

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

exports.getProfile = async (req, res) => {
  // read token from headers if present
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, profile: user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
