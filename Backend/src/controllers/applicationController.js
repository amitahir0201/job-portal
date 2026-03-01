const Application = require('../models/Application');
const Job = require('../models/Job');

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

    // Get resume file path or URL
    let resumeURL = null;
    if (req.file) {
      // If file was uploaded, create path or URL
      resumeURL = `/uploads/resumes/${req.file.filename}`;
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

    // increment job applicationsCount
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

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
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ success: false, message: 'Not found' });
  app.status = status;
  app.updatedAt = new Date();
  await app.save();
  res.json({ success: true, application: app });
};

exports.scheduleInterview = async (req, res) => {
  const { interviewDate, interviewMessage } = req.body;
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ success: false });
  app.status = 'Interview Scheduled';
  app.interviewScheduledAt = interviewDate;
  app.interviewMessage = interviewMessage;
  app.updatedAt = new Date();
  await app.save();
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
  res.json({ success: true });
};