const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, index: true },
    password: { type: String },
    role: { type: String, enum: ['jobseeker', 'recruiter'], default: 'jobseeker' },

    // profile
    phone: String,
    headline: String,
    summary: String,
    location: String,
    experienceLevel: String,
    profilePhoto: String,
    resumeURL: String,
    portfolioUrl: String,
    linkedinUrl: String,
    githubUrl: String,
    majorProjectLink: String,
    skills: [String],
    education: [Object],
    workExperience: [Object],
    certifications: [Object],
    companyName: String, // for recruiters

    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    // password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.matchPassword = async function matchPassword(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
