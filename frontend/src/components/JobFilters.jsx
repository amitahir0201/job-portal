import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';

const JobFilters = ({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  experienceLevel,
  setExperienceLevel,
  jobType,
  setJobType,
  salaryRange,
  setSalaryRange,
  sortBy,
  setSortBy,
  onClearFilters,
  jobCount,
}) => {
  // Check if any filters are applied
  const hasActiveFilters = useMemo(
    () =>
      searchTerm ||
      location ||
      experienceLevel ||
      jobType ||
      salaryRange[0] > 0 ||
      salaryRange[1] < 1000000 ||
      sortBy !== 'newest',
    [searchTerm, location, experienceLevel, jobType, salaryRange, sortBy]
  );

  return (
    <div className="space-y-6">
      {/* Header with Total Count */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Next Job</h1>
          <p className="text-gray-600 mt-1">
            {jobCount} job{jobCount !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <Search className="absolute left-6 top-5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by job title, company, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 outline-none text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Filter Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
            <input
              type="text"
              placeholder="e.g., New York, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Experience Level Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white"
            >
              <option value="">All Levels</option>
              <option value="Entry">Entry / Fresher</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead / Executive</option>
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Salary Range Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Salary Range (Annual)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={salaryRange[0]}
                  onChange={(e) => {
                    const nextMin = Math.max(0, Number(e.target.value) || 0);
                    setSalaryRange([nextMin, Math.max(nextMin, salaryRange[1])]);
                  }}
                  placeholder="Min salary"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white"
                />
              </div>
              <div>
                <input
                  type="number"
                  min={salaryRange[0]}
                  step="1000"
                  value={salaryRange[1]}
                  onChange={(e) => {
                    const nextMax = Math.max(salaryRange[0], Number(e.target.value) || salaryRange[0]);
                    setSalaryRange([salaryRange[0], nextMax]);
                  }}
                  placeholder="Max salary"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Current: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
            </p>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 text-gray-900 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="salaryHigh">Salary: High to Low</option>
              <option value="salaryLow">Salary: Low to High</option>
              <option value="deadline">Deadline Soon</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-bold text-sm border border-red-200"
            >
              <X size={18} />
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
