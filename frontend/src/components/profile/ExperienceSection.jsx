import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

const ExperienceSection = ({ experiences = [] }) => {
  if (!experiences || experiences.length === 0) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase size={24} className="text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
      </div>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="border-l-4 border-emerald-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
            <p className="text-emerald-600 font-semibold">{exp.company}</p>

            <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
              <Calendar size={16} />
              <span>
                {formatDate(exp.startDate)} -{' '}
                {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
              </span>
            </div>

            {exp.description && (
              <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
