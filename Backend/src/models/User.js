const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['admin', 'recruiter', 'jobseeker', 'seeker'],
      default: 'jobseeker',
      lowercase: true,
      trim: true,
    },

    // profile fields
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
    companyName: String, 

    savedJobs: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
    ],

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);