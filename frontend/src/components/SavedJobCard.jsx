import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Code,
  Bookmark,
  ArrowRight,
} from 'lucide-react';

const SavedJobCard = ({ job, onRemove }) => {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveSaved = async () => {
    setIsRemoving(true);
    await onRemove(job._id);
    setIsRemoving(false);
  };

  const getExperienceBadgeColor = (level) => {
    const colors = {
      Fresher: 'bg-emerald-100 text-emerald-700',
      Entry: 'bg-cyan-100 text-cyan-700',
      Mid: 'bg-yellow-100 text-yellow-700',
      Senior: 'bg-red-100 text-red-700',
      Executive: 'bg-indigo-100 text-indigo-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getJobTypeBadgeColor = (type) => {
    const colors = {
      'Full-time': 'bg-blue-100 text-blue-700',
      'Part-time': 'bg-purple-100 text-purple-700',
      Contract: 'bg-orange-100 text-orange-700',
      Freelance: 'bg-pink-100 text-pink-700',
      Internship: 'bg-green-100 text-green-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const displaySkills = job.requiredSkills?.slice(0, 3) || [];
  const moreSkills = job.requiredSkills?.length > 3 ? job.requiredSkills.length - 3 : 0;

  const daysUntilDeadline = job.applicationDeadline
    ? Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-300 transition overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{job.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{job.companyName}</p>
          </div>
          <button
            onClick={handleRemoveSaved}
            disabled={isRemoving}
            className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Remove from saved"
          >
            <Bookmark size={20} className="fill-emerald-600 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="px-6 py-4 space-y-3 border-b border-gray-100">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{job.location}</span>
        </div>

        {/* Salary */}
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign size={16} className="text-emerald-600 flex-shrink-0" />
            <span>
              ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}/year
            </span>
          </div>
        )}

        {/* Deadline */}
        {daysUntilDeadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Code size={16} className="text-emerald-600 flex-shrink-0" />
            <span className={daysUntilDeadline > 7 ? 'text-gray-600' : 'text-red-600 font-semibold'}>
              {daysUntilDeadline > 0 ? `${daysUntilDeadline}d left to apply` : 'Application closed'}
            </span>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-gray-100">
        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${getJobTypeBadgeColor(job.jobType)}`}>
          {job.jobType}
        </span>
        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${getExperienceBadgeColor(job.experienceLevel)}`}>
          {job.experienceLevel}
        </span>
      </div>

      {/* Skills */}
      {displaySkills.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
            {moreSkills > 0 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                +{moreSkills} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-6 flex flex-col gap-3 mt-auto">
        <button
          onClick={() => navigate(`/job-details/${job._id}`)}
          className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-bold text-sm flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate(`/job-details/${job._id}`)}
          className="w-full px-4 py-2 border border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-lg transition font-bold text-sm"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default SavedJobCard;
