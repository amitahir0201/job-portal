const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  answer: String,
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true }, 
  email: { type: String, required: true },
  phone: { type: String },
  resumeURL: String,
  coverLetter: String,
  linkedinLink: String,
  githubLink: String,
  portfolioLink: String,
  majorProjectLink: String,
  answers: [answerSchema],
  status: {
    type: String,
    enum: ['New', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired', 'Withdrawn'],
    default: 'New',
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  interviewScheduledAt: Date,
  interviewMessage: String,
  notes: String,
  rating: Number,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);