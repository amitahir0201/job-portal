const mongoose = require('mongoose');

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
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function matchPassword(candidatePassword) {
  return String(this.password || '') === String(candidatePassword || '');
};

module.exports = mongoose.model('User', userSchema);
