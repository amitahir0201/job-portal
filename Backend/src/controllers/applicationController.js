const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// POST /api/applications/apply
exports.apply = async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      coverLetter,
      linkedinLink,
      githubLink,
      portfolioLink,
      majorProjectLink,
      customAnswers,
    } = req.body;

    // If user authenticated, prefer req.user
    const applicantId = req.user?._id || null;

    // Get resume from GridFS
    let resumeURL = req.body.resumeURL || null;
    if (req.file) {
      resumeURL = req.file.id;
    }


    // Create application
    const application = new Application({
      job: jobId,
      applicant: applicantId,
      fullName: fullName,  
      email: email,        
      phone: phone,
      resumeURL: resumeURL,
      coverLetter,
      linkedinLink,
      githubLink,
      portfolioLink,
      majorProjectLink,
      answers: Object.keys(JSON.parse(customAnswers || '{}')).map((k) => ({
        questionId: k,
        question: '', // frontend question text is stored on job; keep id here
        answer: JSON.parse(customAnswers)[k],
      })),
      status: 'New',
    });

    await application.save();

    // increment job applicationsCount and notify recruiter
    const job = await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } }, { new: true });
    
    if (job && job.postedBy) {
      await Notification.create({
        user: job.postedBy,
        type: 'application',
        title: 'New Application Received',
        message: `${fullName || 'An applicant'} has applied for your job "${job.title}".`,
        relatedId: application._id
      });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// list by job
exports.listByJob = async (req, res) => {
  const apps = await Application.find({ job: req.params.jobId }).populate('applicant');
  res.json({ success: true, applications: apps });
};

// list my applications
exports.listMyApplications = async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id }).populate('job');
  res.json({ success: true, applications: apps });
};

exports.getApplication = async (req, res) => {
  const app = await Application.findById(req.params.id).populate('job applicant');
  if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
  res.json({ success: true, application: app });
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const app = await Application.findById(req.params.id).populate('applicant');
  if (!app) return res.status(404).json({ success: false, message: 'Not found' });
  
  // Ensure fullName and email are present to satisfy validation if they missing
  if (!app.fullName && app.applicant) app.fullName = app.applicant.fullName || app.applicant.name;
  if (!app.email && app.applicant) app.email = app.applicant.email;

  app.status = status;
  app.updatedAt = new Date();
  await app.save();

  // Notify applicant
  const job = await Job.findById(app.job);
  await Notification.create({
    user: app.applicant,
    type: 'application',
    title: 'Application Status Updated',
    message: `Your application for "${job?.title || 'a job'}" has been updated to: ${status}.`,
    relatedId: app._id
  });

  res.json({ success: true, application: app });
};

exports.scheduleInterview = async (req, res) => {
  const { interviewDate, interviewMessage } = req.body;
  const app = await Application.findById(req.params.id).populate('applicant');
  if (!app) return res.status(404).json({ success: false });

  // Ensure fullName and email are present to satisfy validation if they missing
  if (!app.fullName && app.applicant) app.fullName = app.applicant.fullName || app.applicant.name;
  if (!app.email && app.applicant) app.email = app.applicant.email;

  app.status = 'Interview Scheduled';
  app.interviewScheduledAt = interviewDate;
  app.interviewMessage = interviewMessage;
  app.updatedAt = new Date();
  
  try {
    await app.save();
  } catch (err) {
    console.error('DEBUG: Save failed! Error detail:', err);
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        console.error(`Field "${key}" error:`, err.errors[key].message);
      });
    }
    throw err;
  }

  // Notify applicant
  const job = await Job.findById(app.job);
  const formattedDate = new Date(interviewDate).toLocaleString([], {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  await Notification.create({
    user: app.applicant,
    type: 'interview',
    title: 'Interview Scheduled',
    message: `An interview for "${job?.title || 'a job'}" has been scheduled for ${formattedDate}.`,
    relatedId: app._id,
  });

  res.json({ success: true, application: app });
};

exports.rejectApplication = async (req, res) => {
  const { rejectionReason } = req.body;
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ success: false });
  app.status = 'Rejected';
  app.notes = rejectionReason;
  app.updatedAt = new Date();
  await app.save();

  // Notify applicant
  const job = await Job.findById(app.job);
  await Notification.create({
    user: app.applicant,
    type: 'application',
    title: 'Application Update',
    message: `We're sorry, but your application for "${job?.title || 'a job'}" has been rejected.`,
    relatedId: app._id
  });

  res.json({ success: true, application: app });
};

exports.withdraw = async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ success: false });
  // Only applicant can withdraw
  if (String(app.applicant) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Forbidden' });
  app.status = 'Withdrawn';
  app.updatedAt = new Date();
  await app.save();

  // Notify recruiter
  const job = await Job.findById(app.job);
  if (job && job.postedBy) {
    await Notification.create({
      user: job.postedBy,
      type: 'application',
      title: 'Application Withdrawn',
      message: `${req.user.fullName || 'An applicant'} has withdrawn their application for "${job.title}".`,
      relatedId: app._id
    });
  }

  res.json({ success: true });
};