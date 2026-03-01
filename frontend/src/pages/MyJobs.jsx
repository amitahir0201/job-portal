import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RecruiterLayout from '../layouts/RecruiterLayout';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    applications: 0,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs/my');
        setJobs(res.data.jobs || []);
        setStats({
          total: res.data.count,
          applications: 0, 
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 break-words">My Jobs</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your job postings</p>
            </div>
            <button
              onClick={() => navigate('/post-job')}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md active:scale-95 text-center"
            >
              + Post a Job
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-4 sm:p-6">
              <p className="text-[10px] sm:text-sm text-gray-600 font-medium uppercase tracking-wider">Total Jobs</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-4 sm:p-6">
              <p className="text-[10px] sm:text-sm text-gray-600 font-medium uppercase tracking-wider">Active</p>
              <p className="text-xl sm:text-3xl font-bold text-emerald-600 mt-1">
                {jobs.filter((j) => j.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-4 text-sm font-medium">Loading jobs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm break-words">
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <p className="text-yellow-800 font-medium text-sm">
                No job postings yet. Click "Post a Job" to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden flex flex-col hover:shadow-lg transition-all"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-5 border-b border-green-100">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words leading-tight">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">
                          {job.company || 'Your Company'} • {job.location}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap ${
                          job.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 space-y-4 flex-1">
                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-3 break-words leading-relaxed">
                      {job.description}
                    </p>

                    {/* Details Grid - Wraps on very small screens */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                      <div className="bg-green-50/50 rounded-lg p-3 border border-green-100 min-w-0">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Type</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 break-words">
                          {job.jobType || 'Full-Time'}
                        </p>
                      </div>

                      <div className="bg-green-50/50 rounded-lg p-3 border border-green-100 min-w-0">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Experience</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 break-words">
                          {job.experienceLevel || 'Mid'}
                        </p>
                      </div>

                      {(job.salaryMin || job.salaryMax) && (
                        <div className="bg-green-50/50 rounded-lg p-3 border border-green-100 xs:col-span-2 min-w-0">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Salary Range</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 break-all">
                            {job.salaryMin && `${job.currency} ${job.salaryMin}`}
                            {job.salaryMin && job.salaryMax && ' - '}
                            {job.salaryMax && `${job.currency} ${job.salaryMax}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.requiredSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] sm:text-xs font-semibold break-all"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-50">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Card Footer - Responsive Buttons */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-green-100 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/recruiter/job-details/${job._id}`)}
                      className="w-full sm:flex-1 px-3 py-2 text-xs sm:text-sm border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-bold uppercase"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => navigate(`/applicants/${job._id}`)}
                      className="w-full sm:flex-1 px-3 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold uppercase"
                    >
                      Applicants
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold uppercase"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default MyJobs;