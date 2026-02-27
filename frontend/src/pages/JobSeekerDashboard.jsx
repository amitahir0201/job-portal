import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SeekerHeader from '../components/SeekerHeader';
import {
  Briefcase,
  CheckCircle,
  Calendar,
  Bookmark,
  Loader,
  AlertCircle,
  Download,
  FileText,
  MessageCircle,
  ArrowRight,
  MapPin,
  Star,
} from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlisted: 0,
    interviewScheduled: 0,
    savedJobs: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch profile
      const profileRes = await api.get('/auth/profile');
      if (profileRes.data.success) {
        setProfile(profileRes.data.profile);
      }

      // Fetch applications
      try {
        const appsRes = await api.get('/applications/my');
        if (appsRes.data.success && appsRes.data.applications) {
          const applications = appsRes.data.applications;
          setRecentApplications(applications.slice(0, 5));

          // Calculate stats
          setStats((prev) => ({
            ...prev,
            totalApplications: applications.length,
            shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
            interviewScheduled: applications.filter((a) => a.status === 'Interview Scheduled')
              .length,
          }));
        }
      } catch (err) {
        console.log('Applications not available yet');
      }

      // Fetch saved jobs
      try {
        const savedRes = await api.get('/jobs/saved');
        if (savedRes.data.success && savedRes.data.jobs) {
          setStats((prev) => ({ ...prev, savedJobs: savedRes.data.jobs.length }));
        }
      } catch (err) {
        console.log('Saved jobs not available yet');
      }

      // Fetch recommended jobs
      const jobsRes = await api.get('/jobs');
      if (jobsRes.data.success && jobsRes.data.jobs) {
        setRecommendedJobs(jobsRes.data.jobs.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = profile ? calculateProfileCompletion(profile) : 0;

  function calculateProfileCompletion(profileData) {
    const fields = [
      'fullName',
      'email',
      'phone',
      'headline',
      'summary',
      'location',
      'skills',
      'education',
      'workExperience',
      'resumeURL',
    ];
    const completedFields = fields.filter(
      (field) => profileData[field] && profileData[field].length > 0
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  }

  const getStatusColor = (status) => {
    const colors = {
      New: 'bg-blue-100 text-blue-800',
      Shortlisted: 'bg-green-100 text-green-800',
      'Interview Scheduled': 'bg-purple-100 text-purple-800',
      Rejected: 'bg-red-100 text-red-800',
      Hired: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <>
        <SeekerHeader />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeekerHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900">Error Loading Dashboard</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {profile?.fullName || 'Job Seeker'} 👋
          </h1>
          {profile?.headline && (
            <p className="text-lg text-gray-600 mt-2">{profile.headline}</p>
          )}
          {profile?.experienceLevel && (
            <p className="text-sm text-gray-500 mt-1">
              Experience Level: <span className="font-semibold">{profile.experienceLevel}</span>
            </p>
          )}
        </div>

        {/* Profile Completion Card */}
        {profile && profileCompletion < 100 && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-lg">Complete Your Profile</h3>
              <span className="text-sm font-bold text-emerald-600 bg-white px-3 py-1 rounded-full">
                {profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 mb-4">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="text-emerald-600 hover:text-emerald-700 font-bold text-sm inline-flex items-center gap-2 transition"
            >
              Complete Profile
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            label="Applications"
            value={stats.totalApplications}
            color="emerald"
          />
          <StatCard
            icon={CheckCircle}
            label="Shortlisted"
            value={stats.shortlisted}
            color="green"
          />
          <StatCard
            icon={Calendar}
            label="Interviews"
            value={stats.interviewScheduled}
            color="blue"
          />
          <StatCard
            icon={Bookmark}
            label="Saved Jobs"
            value={stats.savedJobs}
            color="purple"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
              <button
                onClick={() => navigate('/applications')}
                className="text-emerald-600 hover:text-emerald-700 font-bold text-sm inline-flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </button>
            </div>

            {recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div
                    key={app._id}
                    className="border border-gray-100 rounded-lg p-4 hover:border-emerald-200 hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/job-details/${(app.job || app.jobId)?._id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{(app.job || app.jobId)?.title || 'Job'}</h3>
                        <p className="text-sm text-gray-600">
                          {(app.job || app.jobId)?.companyName || (app.job || app.jobId)?.company || 'Company'} • Applied{' '}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-4">No applications yet</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-bold text-sm"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <ActionButton
                  icon={Download}
                  label="Upload Resume"
                  onClick={() => navigate('/profile/edit')}
                />
                <ActionButton
                  icon={FileText}
                  label="Edit Profile"
                  onClick={() => navigate('/profile/edit')}
                />
                <ActionButton
                  icon={Briefcase}
                  label="Browse Jobs"
                  onClick={() => navigate('/jobs')}
                />
                <ActionButton
                  icon={MessageCircle}
                  label="View Messages"
                  onClick={() => navigate('/messages')}
                />
              </div>
            </div>

            {/* Profile Card */}
            {profile && (
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Your Profile</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="opacity-90">Email:</span> <br />
                    <span className="font-semibold">{profile.email}</span>
                  </p>
                  {profile.phone && (
                    <p>
                      <span className="opacity-90">Phone:</span> <br />
                      <span className="font-semibold">{profile.phone}</span>
                    </p>
                  )}
                  {profile.location && (
                    <p>
                      <span className="opacity-90">Location:</span> <br />
                      <span className="font-semibold">{profile.location}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-4 w-full bg-white text-emerald-600 font-bold py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  View Full Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs for You</h2>
            <button
              onClick={() => navigate('/jobs')}
              className="text-emerald-600 hover:text-emerald-700 font-bold text-sm inline-flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {recommendedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/job-details/${job._id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Bookmark size={20} className="text-gray-400 hover:text-emerald-600" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                    <MapPin size={14} />
                    {job.location}
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">{job.description}</p>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                          +{job.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-600">
                      ${job.salary?.toLocaleString() || 'N/A'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/job-details/${job._id}`);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-bold text-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No jobs available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-gray-600 text-sm font-semibold">{label}</p>
      <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-lg transition font-semibold text-sm"
    >
      <Icon size={20} />
      {label}
    </button>
  );
};

export default JobSeekerDashboard;


