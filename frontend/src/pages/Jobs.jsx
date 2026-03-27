import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import SeekerHeader from '../components/SeekerHeader';
import JobFilters from '../components/JobFilters';
import JobCard from '../components/JobCard';
import { Loader, AlertCircle, Briefcase } from 'lucide-react';

const JobsPage = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('newest');

  // Saved jobs
  const [savedJobs, setSavedJobs] = useState(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const normalizeText = (value) =>
    String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');

  const normalizeJobType = (value) => {
    const text = normalizeText(value);
    if (text.includes('full')) return 'full time';
    if (text.includes('part')) return 'part time';
    if (text.includes('contract')) return 'contract';
    if (text.includes('freelance')) return 'freelance';
    if (text.includes('intern')) return 'internship';
    if (text.includes('remote')) return 'remote';
    return text;
  };

  const normalizeExperience = (value) => {
    const text = normalizeText(value);
    if (text.includes('fresher') || text.includes('entry')) return 'entry';
    if (text.includes('mid')) return 'mid';
    if (text.includes('senior')) return 'senior';
    if (text.includes('lead') || text.includes('executive')) return 'lead';
    return text;
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, location, experienceLevel, jobType, salaryRange, sortBy]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/jobs');

      if (res.data.success && Array.isArray(res.data.jobs)) {
        setAllJobs(res.data.jobs);
      } else {
        setAllJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
      setAllJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/jobs/saved');
      if (res.data.success && Array.isArray(res.data.jobs)) {
        const savedJobIds = new Set(res.data.jobs.map((job) => job._id));
        setSavedJobs(savedJobIds);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setSavedJobs(new Set());
    }
  };

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let jobs = [...allJobs];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(search) ||
          job.companyName?.toLowerCase().includes(search) ||
          job.requiredSkills?.some((skill) => skill.toLowerCase().includes(search))
      );
    }

    // Location filter
    if (location) {
      const requestedLocation = normalizeText(location);
      jobs = jobs.filter((job) =>
        normalizeText(job.location).includes(requestedLocation)
      );
    }

    // Experience level filter
    if (experienceLevel) {
      const requestedExperience = normalizeExperience(experienceLevel);
      jobs = jobs.filter(
        (job) => normalizeExperience(job.experienceLevel) === requestedExperience
      );
    }

    // Job type filter
    if (jobType) {
      const requestedJobType = normalizeJobType(jobType);
      jobs = jobs.filter((job) => normalizeJobType(job.jobType) === requestedJobType);
    }

    // Salary range filter
    jobs = jobs.filter((job) => {
      const minSalary = Number(job.salaryMin) || 0;
      const maxSalary = Number(job.salaryMax) || minSalary;
      // Match when job salary band overlaps selected salary band.
      return maxSalary >= salaryRange[0] && minSalary <= salaryRange[1];
    });

    // Sorting
    if (sortBy === 'salaryHigh') {
      jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (sortBy === 'salaryLow') {
      jobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    } else if (sortBy === 'deadline') {
      jobs.sort(
        (a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
      );
    } else {
      // newest (default)
      jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return jobs;
  }, [
    allJobs,
    searchTerm,
    location,
    experienceLevel,
    jobType,
    salaryRange,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setExperienceLevel('');
    setJobType('');
    setSalaryRange([0, 1000000]);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleSaveToggle = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await api.post(`/jobs/${jobId}/save`);
        setSavedJobs((prev) => new Set([...prev, jobId]));
      } else {
        await api.post(`/jobs/${jobId}/unsave`);
        setSavedJobs((prev) => {
          const updated = new Set(prev);
          updated.delete(jobId);
          return updated;
        });
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  return (
    <>
      <SeekerHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <JobFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  location={location}
                  setLocation={setLocation}
                  experienceLevel={experienceLevel}
                  setExperienceLevel={setExperienceLevel}
                  jobType={jobType}
                  setJobType={setJobType}
                  salaryRange={salaryRange}
                  setSalaryRange={setSalaryRange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onClearFilters={handleClearFilters}
                  jobCount={allJobs.length}
                />
              </div>
            </div>

            {/* Main Content - Job Listings */}
            <div className="lg:col-span-3">
              {/* Error Message */}
              {error && (
                <div className="mb-6 flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-900">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading jobs...</p>
                  </div>
                </div>
              ) : filteredAndSortedJobs.length === 0 ? (
                // Empty State
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div>
                  {/* Results Summary */}
                  <div className="mb-6">
                    <p className="text-gray-600">
                      Showing{' '}
                      <span className="font-bold">{startIdx + 1}</span>
                      {' '}-{' '}
                      <span className="font-bold">{Math.min(startIdx + itemsPerPage, filteredAndSortedJobs.length)}</span>
                      {' '}of{' '}
                      <span className="font-bold">{filteredAndSortedJobs.length}</span>
                      {' '}jobs
                    </p>
                  </div>

                  {/* Job Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        isSaved={savedJobs.has(job._id)}
                        onSaveToggle={handleSaveToggle}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`px-4 py-2 rounded-lg transition font-semibold ${
                            currentPage === page
                              ? 'bg-emerald-600 text-white'
                              : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsPage;
