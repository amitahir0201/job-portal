import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const ExperienceForm = ({ profile, onUpdate, submitting }) => {
  const [experiences, setExperiences] = useState(profile.workExperience || []);
  const [newExp, setNewExp] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
  });

  const addExperience = () => {
    if (newExp.position && newExp.company && newExp.startDate) {
      setExperiences([...experiences, newExp]);
      setNewExp({
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
      });
    }
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ workExperience: experiences });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add Experience */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">Add Experience</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newExp.position}
              onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
              placeholder="Job Title *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              placeholder="Company *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={newExp.startDate}
              onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="date"
              value={newExp.endDate}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
              disabled={newExp.currentlyWorking}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newExp.currentlyWorking}
              onChange={(e) => setNewExp({ ...newExp, currentlyWorking: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600"
            />
            <span className="text-gray-700 font-semibold">I currently work here</span>
          </label>

          <textarea
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            placeholder="Job description (optional)"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />

          <button
            type="button"
            onClick={addExperience}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Experience
          </button>
        </div>

        {/* Experiences List */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your Experiences ({experiences.length})
          </label>
          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-emerald-500 pl-4 py-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {experiences.length === 0 && (
            <p className="text-gray-600 text-sm">No experience added yet</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save Work Experience'}
        </button>
      </form>
    </div>
  );
};

export default ExperienceForm;
