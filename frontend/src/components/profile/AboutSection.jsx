import React from 'react';

const AboutSection = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
        {summary}
      </p>
    </div>
  );
};

export default AboutSection;
