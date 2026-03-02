import { useState } from 'react';
import { Trash2, Plus, X, ListTodo } from 'lucide-react';

const CustomQuestionBuilder = ({ question, index, onChange, onRemove }) => {
  const [showOptions, setShowOptions] = useState(question.type === 'multiple-choice');

  const handleQuestionChange = (field, value) => {
    onChange({
      ...question,
      [field]: value,
    });
    if (field === 'type' && value === 'multiple-choice') {
      setShowOptions(true);
    } else if (field === 'type') {
      setShowOptions(false);
    }
  };

  const handleAddOption = () => {
    onChange({
      ...question,
      options: [...(question.options || []), ''],
    });
  };

  const handleRemoveOption = (optionIndex) => {
    onChange({
      ...question,
      options: question.options.filter((_, i) => i !== optionIndex),
    });
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onChange({
      ...question,
      options: newOptions,
    });
  };

  return (
    <div className="group p-4 sm:p-5 border-2 border-green-200 rounded-xl bg-white hover:border-green-400 transition-all shadow-sm hover:shadow-md">
      {/* Header: Question Number and Delete */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
            Question {index + 1}
          </label>
          <textarea
            value={question.questionText}
            onChange={(e) => handleQuestionChange('questionText', e.target.value)}
            placeholder="e.g., How many years of experience do you have with React?"
            rows="2"
            className="w-full px-4 py-3 border border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all resize-none bg-white text-gray-800 placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-all shrink-0 border border-transparent hover:border-red-100"
          title="Delete Question"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Settings: Type and Required - Responsive Stack */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
        <div className="w-full sm:flex-1">
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
            Question Type
          </label>
          <div className="relative">
            <select
              value={question.type}
              onChange={(e) => handleQuestionChange('type', e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all bg-white text-sm font-medium pr-10"
            >
              <option value="text">Short Text</option>
              <option value="textarea">Long Text</option>
              {/* <option value="yes/no">Yes/No</option> */}
              <option value="multiple-choice">Multiple Choice</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center sm:mt-6">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => handleQuestionChange('required', e.target.checked)}
                className="peer w-5 h-5 rounded border-green-300 text-green-600 accent-green-600 transition-all focus:ring-green-500"
              />
            </div>
            <span className="text-sm font-bold text-gray-700 peer-checked:text-green-700">
              Required
            </span>
          </label>
        </div>
      </div>

      {/* Multiple Choice Options Area */}
      {question.type === 'multiple-choice' && (
        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-4 text-green-800">
            <ListTodo size={18} />
            <label className="text-sm font-bold uppercase tracking-tight">
              Configure Options
            </label>
          </div>
          
          <div className="space-y-3 mb-4">
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2 group/option">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="flex-1 px-4 py-2 border border-green-200 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(optionIndex)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddOption}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-green-600 hover:bg-green-100/50 rounded-lg text-sm font-bold border border-dashed border-green-300 hover:border-green-500 transition-all"
          >
            <Plus size={16} />
            Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomQuestionBuilder;