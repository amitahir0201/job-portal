const User = require('../models/User');
const Company = require('../models/Company');

// GET /api/profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, profile: user });
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  const updates = req.body || {};

  // Frontend alias fields for recruiter profile
  if (typeof updates.designation === 'string') updates.headline = updates.designation;
  if (typeof updates.bio === 'string') updates.summary = updates.bio;
  if (typeof updates.linkedinLink === 'string') updates.linkedinUrl = updates.linkedinLink;

  // If file uploaded, set URL (local file for now)
  if (req.file) {
    updates.profilePhoto = `/uploads/${req.file.filename || req.file.originalname}`;
  }
  
  const user = await User.findById(req.user._id);
  Object.assign(user, updates);
  await user.save();
  
  const updatedUser = await User.findById(req.user._id).select('-password');
  res.json({ success: true, profile: updatedUser });
};

// Company endpoints (basic)
exports.getCompanyProfile = async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) return res.json({ success: false, message: 'No company' });
  res.json({ success: true, data: company });
};

exports.updateCompanyProfile = async (req, res) => {
  const payload = req.body || {};
  if (typeof payload.socialLinks === 'string') {
    try {
      payload.socialLinks = JSON.parse(payload.socialLinks);
    } catch (err) {
      payload.socialLinks = {};
    }
  }
  if (req.file) payload.companyLogo = `/uploads/${req.file.filename || req.file.originalname}`;
  let company = await Company.findOne({ owner: req.user._id });
  if (company) {
    Object.assign(company, payload);
    await company.save();
  } else {
    company = new Company({ owner: req.user._id, ...payload });
    await company.save();
  }
  res.json({ success: true, data: company });
};

// POST /api/profile/upload-photo
exports.uploadPhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const user = await User.findById(req.user._id);
  user.profilePhoto = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({
    success: true,
    message: 'Photo uploaded successfully',
    profilePhoto: user.profilePhoto
  });
};

// POST /api/profile/resume
exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const user = await User.findById(req.user._id);
  user.resumeURL = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({
    success: true,
    message: 'Resume uploaded successfully',
    resumeURL: user.resumeURL
  });
};
