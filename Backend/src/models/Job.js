const mongoose = require('mongoose');

const customQuestionSchema = new mongoose.Schema({
  questionText: String,
  type: { type: String, default: 'text' },
  options: [String],
  required: { type: Boolean, default: false },
}, { _id: true });

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
    linkedin: { type: String, enum: ['none', 'required', 'optional'], default: 'none' },
    github: { type: String, enum: ['none', 'required', 'optional'], default: 'none' },
    portfolio: { type: String, enum: ['none', 'required', 'optional'], default: 'none' },
    majorProject: { type: String, enum: ['none', 'required', 'optional'], default: 'none' },
  },
  customQuestions: [customQuestionSchema],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
