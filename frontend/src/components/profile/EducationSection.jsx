import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';

const EducationSection = ({ educations = [] }) => {
  if (!educations || educations.length === 0) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap size={24} className="text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
      </div>
      <div className="space-y-6">
        {educations.map((edu, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900">
              {edu.degree} {edu.field ? `in ${edu.field}` : ''}
            </h3>
            <p className="text-blue-600 font-semibold">{edu.school}</p>

            {edu.startDate && (
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <Calendar size={16} />
                <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
              </div>
            )}

            {edu.description && (
              <p className="text-gray-700 mt-3 leading-relaxed">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
