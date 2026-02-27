import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SavedJobCard from '../components/SavedJobCard';
import SeekerHeader from '../components/SeekerHeader';
import { Bookmark, AlertCircle, Loader } from 'lucide-react';

const DUMMY_SAVED_JOBS = [
  {
    _id: '1',
    title: 'Senior React Developer',
    companyName: 'TechVentures Inc',
    location: 'San Francisco, CA',
    salaryMin: 120000,
    salaryMax: 160000,
    currency: '$',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    title: 'Full Stack Developer',
    companyName: 'Digital Solutions Ltd',
    location: 'New York, NY',
    salaryMin: 90000,
    salaryMax: 130000,
    currency: '$',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    title: 'Data Science Engineer',
    companyName: 'AI Innovations Co',
    location: 'Remote',
    salaryMin: 110000,
    salaryMax: 150000,
    currency: '$',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Spark'],
    applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    title: 'Frontend Engineer Intern',
    companyName: 'StartupHub',
    location: 'Boston, MA',
    salaryMin: 25000,
    salaryMax: 35000,
    currency: '$',
    jobType: 'Internship',
    experienceLevel: 'Fresher',
    requiredSkills: ['React', 'CSS', 'JavaScript', 'Git'],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    title: 'DevOps Engineer',
    companyName: 'Cloud Systems Inc',
    location: 'Seattle, WA',
    salaryMin: 100000,
    salaryMax: 140000,
    currency: '$',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
    applicationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '6',
    title: 'UI/UX Designer',
    companyName: 'Creative Studios',
    location: 'Los Angeles, CA',
    salaryMin: 80000,
    salaryMax: 120000,
    currency: '$',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    requiredSkills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping', 'User Research'],
    applicationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useDummy, setUseDummy] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/jobs/saved');

      if (res.data.success) {
        setSavedJobs(res.data.jobs || []);
      } else {
        setError('Failed to load saved jobs');
        setUseDummy(true);
        setSavedJobs(DUMMY_SAVED_JOBS);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setUseDummy(true);
      setSavedJobs(DUMMY_SAVED_JOBS);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (jobId) => {
    try {
      const res = await api.post(`/jobs/${jobId}/unsave`);
      if (res.data.success) {
        setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
      }
    } catch (err) {
      console.error('Error removing saved job:', err);
      alert('Failed to remove from saved jobs');
    }
  };

  return (
    <>
      <SeekerHeader />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Saved Jobs</h1>
            <p className="text-lg text-gray-600">Manage jobs you've bookmarked</p>
            {!loading && savedJobs.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
              </p>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error Loading Saved Jobs</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Dummy Data Notice */}
          {useDummy && !error && (
            <div className="mb-8 flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Demo Data</h3>
                <p className="text-blue-700 text-sm">Showing sample jobs for demonstration. Connect to backend API to load real saved jobs.</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading your saved jobs...</p>
            </div>
          ) : savedJobs.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Bookmark size={32} className="text-gray-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved jobs yet</h2>
              <p className="text-gray-600 mb-6">Start bookmarking jobs to save them for later</p>
              <button
                onClick={() => navigate('/jobs')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-bold"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            // Saved Jobs Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <SavedJobCard
                  key={job._id}
                  job={job}
                  onRemove={handleRemoveSaved}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedJobs;
