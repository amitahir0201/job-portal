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

// Calculate profile completion before saving
companySchema.pre('save', function (next) {
  const fields = [
    { name: 'companyName', weight: 10 },
    { name: 'industry', weight: 10 },
    { name: 'companySize', weight: 10 },
    { name: 'foundedYear', weight: 10 },
    { name: 'website', weight: 10 },
    { name: 'location', weight: 10 },
    { name: 'aboutCompany', weight: 20 },
    { name: 'companyLogo', weight: 10 },
    { name: 'socialLinks', weight: 10, isObject: true }
  ];

  let completedWeight = 0;
  fields.forEach(field => {
    const value = this[field.name];
    if (field.isObject) {
      if (value && Object.values(value).some(v => v)) {
        completedWeight += field.weight;
      }
    } else {
      if (value) {
        completedWeight += field.weight;
      }
    }
  });

  this.profileCompletionPercentage = completedWeight;
  next();
});

module.exports = mongoose.model('Company', companySchema);