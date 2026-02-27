const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const mongoose = require('mongoose');

const serializeJob = (jobDoc) => {
  const job = jobDoc?.toObject ? jobDoc.toObject() : jobDoc;
  if (!job) return job;
  return {
    ...job,
    company: job.companyName || job.company || '',
    recruiterId: job.postedBy || null,
    salary: job.salaryMax || job.salaryMin || 0,
  };
};

exports.listJobs = async (req, res) => {
  const jobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 }).limit(200);
  res.json({ success: true, jobs: jobs.map(serializeJob) });
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  job.views = (job.views || 0) + 1;
  await job.save();
  res.json({ success: true, job: serializeJob(job) });
};

exports.createJob = async (req, res) => {
  const body = req.body || {};
  const payload = {
    title: body.title,
    description: body.description,
    location: body.location,
    jobType: body.jobType,
    experienceLevel: body.experienceLevel,
    salaryMin: body.salaryMin,
    salaryMax: body.salaryMax,
    currency: body.currency,
    requiredSkills: body.requiredSkills,
    applicationDeadline: body.applicationDeadline,
    requiredLinks: body.requiredLinks,
    customQuestions: body.customQuestions,
    status: body.status || 'Draft',
    postedBy: req.user._id,
  };

  // Frontend currently sends company as a string label; map it to companyName.
  if (typeof body.companyName === 'string' && body.companyName.trim()) {
    payload.companyName = body.companyName.trim();
  } else if (typeof body.company === 'string' && body.company.trim()) {
    payload.companyName = body.company.trim();
  }

  // Only set relational company field when it is a valid ObjectId.
  if (typeof body.company === 'string' && mongoose.Types.ObjectId.isValid(body.company)) {
    payload.company = body.company;
  }

  const job = await Job.create(payload);
  res.json({ success: true, job: serializeJob(job) });
};

exports.myJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, jobs: jobs.map(serializeJob), count: jobs.length });
};

exports.deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  if (!job.postedBy || !job.postedBy.equals(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }
  await job.deleteOne();
  res.json({ success: true, message: 'Job deleted' });
};

exports.saveJob = async (req, res) => {
  // naive save: we store saved job IDs on user.profile (for demo)
  const jobId = req.params.id;
  const user = await User.findById(req.user._id);
  user.savedJobs = user.savedJobs || [];
  if (!user.savedJobs.includes(jobId)) user.savedJobs.push(jobId);
  await user.save();
  res.json({ success: true });
};

exports.unsaveJob = async (req, res) => {
  const jobId = req.params.id;
  const user = await User.findById(req.user._id);
  user.savedJobs = (user.savedJobs || []).filter((id) => id.toString() !== jobId);
  await user.save();
  res.json({ success: true });
};

exports.getSavedJobs = async (req, res) => {
  const user = await User.findById(req.user._id);
  const ids = user.savedJobs || [];
  const jobs = await Job.find({ _id: { $in: ids } });
  res.json({ success: true, jobs: jobs.map(serializeJob) });
};
