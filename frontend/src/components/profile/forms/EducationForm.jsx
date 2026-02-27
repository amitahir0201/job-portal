import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const EducationForm = ({ profile, onUpdate, submitting }) => {
  const [educations, setEducations] = useState(profile.education || []);
  const [newEdu, setNewEdu] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const addEducation = () => {
    if (newEdu.school && newEdu.degree && newEdu.startDate) {
      setEducations([...educations, newEdu]);
      setNewEdu({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  };

  const removeEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ education: educations });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add Education */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">Add Education</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newEdu.school}
              onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
              placeholder="School/University *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              placeholder="Degree *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <input
            type="text"
            value={newEdu.field}
            onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
            placeholder="Field of Study"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={newEdu.startDate}
              onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="date"
              value={newEdu.endDate}
              onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <textarea
            value={newEdu.description}
            onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
            placeholder="Description (optional)"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />

          <button
            type="button"
            onClick={addEducation}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Education
          </button>
        </div>

        {/* Educations List */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your Education ({educations.length})
          </label>
          <div className="space-y-3">
            {educations.map((edu, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </h4>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {educations.length === 0 && (
            <p className="text-gray-600 text-sm">No education added yet</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save Education'}
        </button>
      </form>
    </div>
  );
};

export default EducationForm;
