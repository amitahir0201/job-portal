import React from 'react';
import { Code } from 'lucide-react';

const SkillsSection = ({ skills = [] }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Code size={24} className="text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-sm hover:bg-emerald-200 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
