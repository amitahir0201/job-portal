import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  CheckCircle,
  DollarSign,
} from 'lucide-react';

const JobCard = ({ job, isSaved = false, onSaveToggle }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(isSaved);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setSaved(!saved);
    if (onSaveToggle) {
      onSaveToggle(job._id, !saved);
    }
  };

  const handleViewDetails = () => {
    navigate(`/job-details/${job._id}`);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Part-time': 'bg-purple-100 text-purple-800',
      Contract: 'bg-orange-100 text-orange-800',
      Freelance: 'bg-pink-100 text-pink-800',
      Internship: 'bg-green-100 text-green-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceColor = (level) => {
    const colors = {
      Fresher: 'bg-emerald-100 text-emerald-800',
      'Entry Level': 'bg-gre-100 text-cyan-800',
      'Mid Level': 'bg-yellow-100 text-yellow-800',
      'Senior Level': 'bg-red-100 text-red-800',
      Executive: 'bg-indigo-100 text-indigo-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatSalary = () => {
    if (!job.salaryMin || !job.salaryMax) return 'Salary N/A';
    return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}${job.currency ? ' ' + job.currency : ''}`;
  };

  const daysUntilDeadline = () => {
    if (!job.applicationDeadline) return null;
    const deadline = new Date(job.applicationDeadline);
    const today = new Date();
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  };

  const days = daysUntilDeadline();

  return (
    <div
      onClick={handleViewDetails}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition cursor-pointer group"
    >
      {/* Header: Title and Save Button */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{job.companyName}</p>
        </div>
        <button
          onClick={handleSaveClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          title={saved ? 'Remove from saved' : 'Save job'}
        >
          <Bookmark
            size={20}
            className={saved ? 'fill-emerald-600 text-emerald-600' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
        <MapPin size={16} className="text-gray-400" />
        {job.location}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.jobType && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(job.jobType)}`}>
            {job.jobType}
          </span>
        )}
        {job.experienceLevel && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExperienceColor(job.experienceLevel)}`}>
            {job.experienceLevel}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 line-clamp-2 mb-4">{job.description}</p>

      {/* Skills */}
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

      {/* Salary and Deadline */}
      <div className="flex items-center justify-between text-sm mb-4 pb-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-gray-700 font-semibold mt-4">
          <DollarSign size={16} className="text-gray-400" />
          {formatSalary()}
        </div>
        {days && (
          <div className="flex items-center gap-1 text-gray-600 mt-4">
            <Clock size={16} className="text-gray-400" />
            <span className="text-xs font-semibold">{days}d left</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleViewDetails}
          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-bold text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
