import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SeekerHeader from '../components/SeekerHeader';
import ApplicationStatusCards from '../components/ApplicationStatusCards';
import ApplicationsTable from '../components/ApplicationsTable';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import { AlertCircle, Loader } from 'lucide-react';

// Demo applications data
const DUMMY_APPLICATIONS = [
  {
    _id: 'app1',
    jobId: '123',
    job: {
      _id: '123',
      title: 'Senior React Developer',
      companyName: 'TechVentures Inc',
      location: 'San Francisco, CA',
      salaryMin: 120000,
      salaryMax: 160000,
      currency: '$',
    },
    resumeURL: 'https://example.com/resume1.pdf',
    coverLetter: 'I am passionate about React development and have 5+ years of experience.',
    portfolioLink: 'https://johndoe.dev',
    linkedinLink: 'https://linkedin.com/in/johndoe',
    githubLink: 'https://github.com/johndoe',
    majorProjectLink: 'https://github.com/johndoe/awesome-project',
    answers: [
      {
        questionId: 'q1',
        question: 'How many years of React experience do you have?',
        answer: '5+ years',
      },
      {
        questionId: 'q2',
        question: 'Describe a challenging project you worked on',
        answer: 'Built a real-time dashboard with WebSocket integration that handles 10k+ concurrent users.',
      },
      {
        questionId: 'q3',
        question: 'Are you willing to work in San Francisco on-site?',
        answer: 'yes',
      },
    ],
    status: 'Shortlisted',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'app2',
    jobId: '124',
    job: {
      _id: '124',
      title: 'Full Stack JavaScript Developer',
      companyName: 'CloudNine Solutions',
      location: 'New York, NY',
      salaryMin: 100000,
      salaryMax: 140000,
      currency: '$',
    },
    resumeURL: 'https://example.com/resume2.pdf',
    coverLetter: 'Excited to work on challenging full-stack projects.',
    portfolioLink: 'https://johndoe.dev',
    linkedinLink: 'https://linkedin.com/in/johndoe',
    githubLink: 'https://github.com/johndoe',
    majorProjectLink: '',
    answers: [],
    status: 'New',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'app3',
    jobId: '125',
    job: {
      _id: '125',
      title: 'Frontend Engineer',
      companyName: 'DesignHub Pro',
      location: 'Austin, TX',
      salaryMin: 90000,
      salaryMax: 130000,
      currency: '$',
    },
    resumeURL: 'https://example.com/resume3.pdf',
    coverLetter: 'I love creating beautiful user interfaces.',
    portfolioLink: 'https://johndoe.dev',
    linkedinLink: 'https://linkedin.com/in/johndoe',
    githubLink: 'https://github.com/johndoe',
    majorProjectLink: 'https://github.com/johndoe/design-system',
    answers: [],
    status: 'Interview Scheduled',
    appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'app4',
    jobId: '126',
    job: {
      _id: '126',
      title: 'Node.js Backend Developer',
      companyName: 'DataCore Systems',
      location: 'Seattle, WA',
      salaryMin: 110000,
      salaryMax: 150000,
      currency: '$',
    },
    resumeURL: 'https://example.com/resume4.pdf',
    coverLetter: 'Expert in building scalable backend systems.',
    portfolioLink: '',
    linkedinLink: 'https://linkedin.com/in/johndoe',
    githubLink: 'https://github.com/johndoe',
    majorProjectLink: 'https://github.com/johndoe/backend-api',
    answers: [],
    status: 'Rejected',
    appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'app5',
    jobId: '127',
    job: {
      _id: '127',
      title: 'UI/UX Developer',
      companyName: 'Pixel Perfect Inc',
      location: 'Los Angeles, CA',
      salaryMin: 95000,
      salaryMax: 135000,
      currency: '$',
    },
    resumeURL: 'https://example.com/resume5.pdf',
    coverLetter: 'Passionate about user-centered design and development.',
    portfolioLink: 'https://johndoe.dev',
    linkedinLink: 'https://linkedin.com/in/johndoe',
    githubLink: 'https://github.com/johndoe',
    majorProjectLink: '',
    answers: [],
    status: 'Reviewed',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'app6',
    jobId: '128',
    job: {
      _id: '128',
      title: 'Senior Software Engineer',
      companyName: 'InnovateTech Corp',
      location: 'Boston, MA',
      salaryMin: 130000,
      salaryMax: 170000,
      currency: '$',
    },
    resumeURL: 'https://example.com/resume6.pdf',
    coverLetter: 'Ready to lead innovation in software engineering.',
    portfolioLink: 'https://johndoe.dev',
    linkedinLink: 'https://linkedin.com/in/johndoe',
    githubLink: 'https://github.com/johndoe',
    majorProjectLink: 'https://github.com/johndoe/innovation-project',
    answers: [],
    status: 'Hired',
    appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDummy, setUseDummy] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/applications/my');

      if (response.data.success && response.data.applications) {
        setApplications(response.data.applications);
        setUseDummy(false);
      } else {
        setUseDummy(true);
        setApplications(DUMMY_APPLICATIONS);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications');
      setUseDummy(true);
      setApplications(DUMMY_APPLICATIONS);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatusCounts = () => {
    const counts = {
      New: 0,
      Reviewed: 0,
      Shortlisted: 0,
      'Interview Scheduled': 0,
      Rejected: 0,
      Hired: 0,
    };

    applications.forEach((app) => {
      if (counts.hasOwnProperty(app.status)) {
        counts[app.status]++;
      }
    });

    return counts;
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        const response = await api.post(`/applications/${applicationId}/withdraw`);
        if (response.data.success) {
          setApplications(applications.map((app) =>
            app._id === applicationId ? { ...app, status: 'Withdrawn' } : app
          ));
          if (showModal && selectedApplication._id === applicationId) {
            setShowModal(false);
          }
        }
      } catch (err) {
        alert('Failed to withdraw application');
      }
    }
  };

  const statusCounts = calculateStatusCounts();

  return (
    <>
      <SeekerHeader />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track and manage your job applications</p>
            <p className="text-sm text-gray-500 mt-2">
              Total Applications: <span className="font-bold text-emerald-600">{applications.length}</span>
            </p>
          </div>

          {/* Demo Notice */}
          {useDummy && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Demo Data</h3>
                <p className="text-blue-700 text-sm">
                  Showing sample applications for demonstration. Connect to backend API to load real applications.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !useDummy && (
            <div className="mb-6 flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">Start applying to job postings to see your applications here.</p>
              <a
                href="/jobs"
                className="inline-block px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
              >
                Browse Jobs
              </a>
            </div>
          ) : (
            <>
              {/* Status Cards */}
              <ApplicationStatusCards statusCounts={statusCounts} />

              {/* Applications Table */}
              <ApplicationsTable
                applications={applications}
                onViewDetails={handleViewDetails}
                onWithdraw={handleWithdraw}
              />
            </>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onWithdraw={() => handleWithdraw(selectedApplication._id)}
        />
      )}
    </>
  );
};

export default MyApplications;
