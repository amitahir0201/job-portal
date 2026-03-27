import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const SkillsInput = ({ skills, onAddSkill, onRemoveSkill }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddSkill(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Input Section - Responsive Flex direction */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., React, Node.js, TypeScript"
            className="w-full px-4 py-2.5 border border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all bg-white text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-semibold shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>

      {/* Skills Display - Improved wrap and touch targets */}
      <div className="min-h-[40px]">
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
            {skills.map((skill, index) => (
              <div
                key={`${skill}-${index}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 text-green-700 rounded-full text-sm font-medium shadow-sm hover:border-green-200 transition-colors"
              >
                <span className="max-w-[150px] sm:max-w-xs truncate">{skill}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(index)}
                  className="hover:bg-green-200 p-1 rounded-full transition-colors text-green-600 hover:text-green-800 focus:outline-none"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-500 text-center px-4">
              No skills added yet. Enter a skill and click "Add" or press Enter.
            </p>
          </div>
        )}
      </div>

      {/* Character Info / Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 pt-2 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Total skills: <span className="text-green-600">{skills.length}</span>
        </p>
        <p className="hidden sm:block text-xs text-gray-400">
          Tip: Press Enter to quickly add skills
        </p>
      </div>
    </div>
  );
};

export default SkillsInput;