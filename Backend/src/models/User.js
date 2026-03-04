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

    // Email verification
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    profileCompletionPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password and calculate profile completion before saving
userSchema.pre('save', async function (next) {
  // Hash password
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }

  // Calculate Profile Completion Percentage
  const fields = [
    { name: 'fullName', weight: 10 },
    { name: 'email', weight: 10 },
    { name: 'phone', weight: 15 },
    { name: 'headline', weight: 15 },
    { name: 'summary', weight: 20 },
    { name: 'linkedinUrl', weight: 15 },
    { name: 'profilePhoto', weight: 15 }
  ];

  let completedWeight = 0;
  fields.forEach(field => {
    if (this[field.name] && (Array.isArray(this[field.name]) ? this[field.name].length > 0 : true)) {
      completedWeight += field.weight;
    }
  });

  this.profileCompletionPercentage = completedWeight;
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);