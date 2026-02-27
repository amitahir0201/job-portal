const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: String,
  industry: String,
  companySize: String,
  foundedYear: String,
  website: String,
  location: String,
  aboutCompany: String,
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
  },
  companyLogo: String,
  profileCompletionPercentage: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);