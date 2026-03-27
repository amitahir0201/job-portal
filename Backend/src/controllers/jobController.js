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
  try {
    const jobs = await Job.find({ status: 'Active' })
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, jobs: jobs.map(serializeJob) });
  } catch (error) {
    console.error("listJobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    job.views = (job.views || 0) + 1;
    await job.save();

    res.json({ success: true, job: serializeJob(job) });
  } catch (error) {
    console.error("getJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

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

    if (typeof body.companyName === 'string' && body.companyName.trim()) {
      payload.companyName = body.companyName.trim();
    } else if (typeof body.company === 'string' && body.company.trim()) {
      payload.companyName = body.company.trim();
    }

    if (
      typeof body.company === 'string' &&
      mongoose.Types.ObjectId.isValid(body.company)
    ) {
      payload.company = body.company;
    }

    const job = await Job.create(payload);

    // Notify seekers if job is Active
    if (job.status === 'Active') {
      const Notification = require('../models/Notification');
      const seekers = await User.find({ role: { $in: ['jobseeker', 'seeker'] } });
      
      const notifications = seekers.map(seeker => ({
        user: seeker._id,
        type: 'job',
        title: 'New Job Posted',
        message: `A new job "${job.title}" has been posted by ${payload.companyName || 'a company'}.`,
        relatedId: job._id
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.json({ success: true, job: serializeJob(job) });
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.myJobs = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs: jobs.map(serializeJob),
      count: jobs.length
    });
  } catch (error) {
    console.error("myJobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (!job.postedBy || !job.postedBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    console.error("deleteJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveJob = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const jobId = req.params.id;

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.savedJobs = user.savedJobs || [];

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error("saveJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const jobId = req.params.id;

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.savedJobs = (user.savedJobs || []).filter(
      (id) => id.toString() !== jobId
    );

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error("unsaveJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const ids = user.savedJobs || [];

    const jobs = await Job.find({ _id: { $in: ids } });

    res.json({ success: true, jobs: jobs.map(serializeJob) });
  } catch (error) {
    console.error("getSavedJobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (!job.postedBy || !job.postedBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    const body = req.body || {};

    Object.keys(body).forEach((key) => {
      job[key] = body[key];
    });

    await job.save();

    res.json({ success: true, job: serializeJob(job) });
  } catch (error) {
    console.error("updateJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateJobStatus = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { status } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (!job.postedBy || !job.postedBy.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    job.status = status;
    await job.save();

    res.json({ success: true, job: serializeJob(job) });
  } catch (error) {
    console.error("updateJobStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};