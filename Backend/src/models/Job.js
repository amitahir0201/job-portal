const mongoose = require('mongoose');

const customQuestionSchema = new mongoose.Schema({
  questionText: String,
  type: { type: String, default: 'text' },
  options: [String],
  required: { type: Boolean, default: false },
}, { _id: true });

const linkRequirementSchema = new mongoose.Schema({
  required: { type: Boolean, default: false },
  optional: { type: Boolean, default: false },
}, { _id: false });

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  companyName: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  location: String,
  salaryMin: Number,
  salaryMax: Number,
  currency: { type: String, default: '$' },
  jobType: String,
  experienceLevel: String,
  requiredSkills: [String],
  applicationDeadline: Date,
  status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Draft' },
  views: { type: Number, default: 0 },
  applicationsCount: { type: Number, default: 0 },
  requiredLinks: {
    linkedin: { type: linkRequirementSchema, default: () => ({}) },
    github: { type: linkRequirementSchema, default: () => ({}) },
    portfolio: { type: linkRequirementSchema, default: () => ({}) },
    majorProject: { type: linkRequirementSchema, default: () => ({}) },
  },
  customQuestions: [customQuestionSchema],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
