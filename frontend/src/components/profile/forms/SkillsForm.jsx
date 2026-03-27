import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const SkillsForm = ({ profile, onUpdate, submitting }) => {
  const [skills, setSkills] = useState(profile.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ skills });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add Skill */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill (e.g., React, JavaScript)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Skills List */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your Skills ({skills.length})
          </label>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full"
              >
                <span className="font-semibold">{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="hover:bg-emerald-200 rounded-full p-1 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {skills.length === 0 && (
            <p className="text-gray-600 text-sm">No skills added yet</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save Skills'}
        </button>
      </form>
    </div>
  );
};

export default SkillsForm;
