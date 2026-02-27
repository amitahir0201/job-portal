import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ApplyJobModal from '../components/ApplyJobModal';
import SeekerHeader from '../components/SeekerHeader';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Code,
  ArrowLeft,
  AlertCircle,
  Bookmark,
  Loader,
  Github,
  Linkedin,
  Globe,
  FileText,
} from 'lucide-react';

const DUMMY_JOB = {
  _id: '123',
  title: 'Senior React Developer',
  description:
    'We are looking for an experienced React developer to join our fast-growing team. You will work on building scalable web applications using modern technologies like React, TypeScript, and Node.js.\n\nKey Responsibilities:\n- Develop and maintain React applications\n- Collaborate with designers and backend engineers\n- Write clean, maintainable code\n- Participate in code reviews\n- Contribute to technical discussions',
  companyName: 'TechVentures Inc',
  location: 'San Francisco, CA',
  salaryMin: 120000,
  salaryMax: 160000,
  currency: '$',
  jobType: 'Full-time',
  experienceLevel: 'Senior',
  requiredSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'PostgreSQL'],
  applicationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  requiredLinks: {
    linkedin: { required: true, optional: false },
    github: { required: true, optional: false },
    portfolio: { required: false, optional: true },
    majorProject: { required: false, optional: true },
  },
  customQuestions: [
    {
      _id: 'q1',
      questionText: 'How many years of React experience do you have?',
      type: 'text',
      required: true,
    },
    {
      _id: 'q2',
      questionText: 'Describe a challenging project you worked on',
      type: 'textarea',
      required: true,
    },
    {
      _id: 'q3',
      questionText: 'Are you willing to work in San Francisco on-site?',
      type: 'yes-no',
      required: true,
    },
    {
      _id: 'q4',
      questionText: 'What is your preferred tech stack?',
      type: 'multiple-choice',
      options: ['MERN', 'Next.js + Node.js', 'React + Django', 'Other'],
      required: false,
    },
  ],
};

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [useDummy, setUseDummy] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchSavedStatus();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/jobs/${id}`);

      if (res.data.success && res.data.job) {
        setJob(res.data.job);
      } else {
        setUseDummy(true);
        setJob(DUMMY_JOB);
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      setUseDummy(true);
      setJob(DUMMY_JOB);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedStatus = async () => {
    try {
      const res = await api.get('/jobs/saved');
      if (res.data.success && res.data.jobs) {
        setSaved(res.data.jobs.some((j) => j._id === id));
      }
    } catch (err) {
      console.error('Error fetching saved status:', err);
      setSaved(false);
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (saved) {
        await api.post(`/jobs/${id}/unsave`);
      } else {
        await api.post(`/jobs/${id}/save`);
      }
      setSaved(!saved);
    } catch (err) {
      console.error('Error toggling save:', err);
      alert('Failed to save job');
    }
  };

  const daysUntilDeadline = job?.applicationDeadline
    ? Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <>
        <SeekerHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading job details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !job) {
    return (
      <>
        <SeekerHeader />
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition font-semibold"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error Loading Job</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <SeekerHeader />
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-5xl mx-auto text-center py-20">
            <p className="text-gray-600 text-lg">Job not found</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeekerHeader />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Demo Data Notice */}
          {useDummy && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Demo Data</h3>
                <p className="text-blue-700 text-sm">
                  Showing sample job for demonstration. Connect to backend API to load real jobs.
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition font-semibold"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-8 text-white">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                  <p className="text-emerald-100 text-lg">{job.companyName}</p>
                </div>
                <button
                  onClick={handleSaveToggle}
                  className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  title={saved ? 'Remove from saved' : 'Save job'}
                >
                  <Bookmark
                    size={24}
                    className={saved ? 'fill-white text-white' : 'text-emerald-100'}
                  />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-emerald-100 text-xs font-semibold uppercase mb-1">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <p className="font-semibold">{job.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs font-semibold uppercase mb-1">Job Type</p>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    <p className="font-semibold">{job.jobType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs font-semibold uppercase mb-1">Level</p>
                  <div className="flex items-center gap-2">
                    <Code size={16} />
                    <p className="font-semibold">{job.experienceLevel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs font-semibold uppercase mb-1">Deadline</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <p className="font-semibold">
                      {daysUntilDeadline && daysUntilDeadline > 0
                        ? `${daysUntilDeadline}d left`
                        : 'Closed'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={20} className="text-emerald-600" />
                  <h3 className="font-bold text-gray-900">Salary Range</h3>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {job.currency}
                  {job.salaryMin?.toLocaleString()} - {job.currency}
                  {job.salaryMax?.toLocaleString()}
                  <span className="text-sm text-gray-600 ml-2">per year</span>
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Role</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p className="whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Required Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Required Links */}
            {Object.values(job.requiredLinks || {}).some((v) => v.required || v.optional) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Information</h2>
                <div className="space-y-3">
                  {job.requiredLinks?.linkedin && (job.requiredLinks.linkedin.required || job.requiredLinks.linkedin.optional) && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Linkedin size={20} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">LinkedIn Profile</p>
                        <p className="text-xs text-gray-600">
                          {job.requiredLinks.linkedin.required ? (
                            <span className="text-red-600 font-bold">Required</span>
                          ) : (
                            <span className="text-gray-600">Optional</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {job.requiredLinks?.github && (job.requiredLinks.github.required || job.requiredLinks.github.optional) && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Github size={20} className="text-gray-900" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">GitHub Profile</p>
                        <p className="text-xs text-gray-600">
                          {job.requiredLinks.github.required ? (
                            <span className="text-red-600 font-bold">Required</span>
                          ) : (
                            <span className="text-gray-600">Optional</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {job.requiredLinks?.portfolio && (
                    (job.requiredLinks.portfolio.required || job.requiredLinks.portfolio.optional) && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Globe size={20} className="text-emerald-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Portfolio</p>
                          <p className="text-xs text-gray-600">
                            {job.requiredLinks.portfolio.required ? (
                              <span className="text-red-600 font-bold">Required</span>
                            ) : (
                              <span className="text-gray-600">Optional</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  {job.requiredLinks?.majorProject && (
                    (job.requiredLinks.majorProject.required || job.requiredLinks.majorProject.optional) && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText size={20} className="text-purple-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Major Project</p>
                          <p className="text-xs text-gray-600">
                            {job.requiredLinks.majorProject.required ? (
                              <span className="text-red-600 font-bold">Required</span>
                            ) : (
                              <span className="text-gray-600">Optional</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Custom Questions */}
            {job.customQuestions && job.customQuestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Screening Questions</h2>
                <div className="space-y-4">
                  {job.customQuestions.map((question, idx) => (
                    <div key={question._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-gray-900">
                          Q{idx + 1}. {question.questionText}
                        </p>
                        {question.required && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold whitespace-nowrap">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Type: {question.type}</p>
                      {question.options && (
                        <div className="mt-2 space-y-1">
                          {question.options.map((option) => (
                            <p key={option} className="text-sm text-gray-700">
                              • {option}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sticky bottom-6">
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-bold text-lg"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyJobModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={() => {
          alert('Application submitted successfully!');
        }}
      />
    </>
  );
};

export default JobDetailsPage;
