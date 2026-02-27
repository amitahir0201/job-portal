import React, { useState } from 'react';

const AboutForm = ({ profile, onUpdate, submitting }) => {
  const [summary, setSummary] = useState(profile.summary || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ summary });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Professional Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Tell us about yourself, your experience, and career goals..."
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-600 mt-2">
            {summary.length}/1000 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save About'}
        </button>
      </form>
    </div>
  );
};

export default AboutForm;
