import React, { useState, useEffect } from 'react';
import { X, Loader, Check } from 'lucide-react';
import api from '../services/api';

const DUMMY_PROFILE = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  linkedinLink: 'https://linkedin.com/in/johndoe',
  githubLink: 'https://github.com/johndoe',
  portfolioLink: 'https://johndoe.dev',
  majorProjectLink: 'https://github.com/johndoe/awesome-project',
  resumeUrl: 'https://johndoe.s3.amazonaws.com/resume.pdf',
};

const ApplyJobModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [profile, setProfile] = useState(DUMMY_PROFILE);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeFile: null,
    coverLetter: '',
    linkedinLink: '',
    githubLink: '',
    portfolioLink: '',
    majorProjectLink: '',
    customAnswers: {},
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useDummy, setUseDummy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      if (res.data.success) {
        setProfile(res.data.profile);
        populateForm(res.data.profile);
      } else {
        setUseDummy(true);
        populateForm(DUMMY_PROFILE);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUseDummy(true);
      populateForm(DUMMY_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (profileData) => {
    const answers = {};
    job?.customQuestions?.forEach((q) => {
      answers[q._id] = '';
    });

    setFormData({
      fullName: profileData.fullName || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      resumeFile: null,
      coverLetter: '',
      linkedinLink: profileData.linkedinLink || '',
      githubLink: profileData.githubLink || '',
      portfolioLink: profileData.portfolioLink || '',
      majorProjectLink: profileData.majorProjectLink || '',
      customAnswers: answers,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.resumeFile) newErrors.resumeFile = 'Resume PDF is required';

    // Check required links
    if (job?.requiredLinks?.linkedin?.required && !formData.linkedinLink.trim()) {
      newErrors.linkedin = 'LinkedIn profile is required for this job';
    }
    if (job?.requiredLinks?.github?.required && !formData.githubLink.trim()) {
      newErrors.github = 'GitHub profile is required for this job';
    }
    if (job?.requiredLinks?.portfolio?.required && !formData.portfolioLink.trim()) {
      newErrors.portfolio = 'Portfolio is required for this job';
    }
    if (job?.requiredLinks?.majorProject?.required && !formData.majorProjectLink.trim()) {
      newErrors.majorProject = 'Major project link is required for this job';
    }

    // Check custom questions
    job?.customQuestions?.forEach((q) => {
      if (q.required && !formData.customAnswers[q._id]?.trim()) {
        newErrors[`question_${q._id}`] = `${q.questionText} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('jobId', job._id);
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      if (formData.resumeFile) {
        submitData.append('resume', formData.resumeFile);
      }
      submitData.append('coverLetter', formData.coverLetter);
      submitData.append('linkedinLink', formData.linkedinLink);
      submitData.append('githubLink', formData.githubLink);
      submitData.append('portfolioLink', formData.portfolioLink);
      submitData.append('majorProjectLink', formData.majorProjectLink);
      submitData.append('customAnswers', JSON.stringify(formData.customAnswers));
      
      const res = await api.post(`/applications/apply`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors({ submit: res.data.message || 'Failed to submit application' });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to submit application' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 backdrop-blur-sm">
      <style>{`
        .modal-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 4px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-3 xs:p-4 sm:p-6 flex items-start xs:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold break-words">{job?.title ? `Apply for ${job.title}` : 'Apply for Job'}</h2>
            <p className="text-emerald-100 text-xs xs:text-sm mt-1">{job?.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X size={20} className="xs:w-6 xs:h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-3 xs:p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Demo Data Notice */}
            {useDummy && (
              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-xs sm:text-sm font-medium">
                  📌 Using demo data. Connect to backend API for real user profile.
                </p>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs sm:text-sm font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-bold text-base xs:text-lg text-gray-900">Personal Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm ${
                      errors.fullName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm ${
                    errors.phone ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Resume File Upload */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-900">
                Resume (PDF) <span className="text-red-600">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                errors.resumeFile ? 'border-red-300 bg-red-50' : 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
              }`}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type === 'application/pdf') {
                      setFormData({ ...formData, resumeFile: file });
                      setErrors({ ...errors, resumeFile: null });
                    } else if (file) {
                      setErrors({ ...errors, resumeFile: 'Please upload a valid PDF file' });
                    }
                  }}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer block">
                  <p className="text-sm font-semibold text-emerald-700 mb-1">
                    {formData.resumeFile ? `✓ ${formData.resumeFile.name}` : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-600">PDF file only (Max 5MB)</p>
                </label>
              </div>
              {errors.resumeFile && <p className="text-red-600 text-xs mt-2">{errors.resumeFile}</p>}
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-900">
                Cover Letter (Optional)
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-none text-sm"
                rows="3"
                placeholder="Tell the recruiter why you're interested in this role..."
              />
            </div>

            {/* Required Links */}
            {Object.values(job?.requiredLinks || {}).some((v) => v.required || v.optional) && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Professional Links</h3>

                {job?.requiredLinks?.linkedin?.required && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      LinkedIn Profile <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinLink}
                      onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                        errors.linkedin ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    {errors.linkedin && <p className="text-red-600 text-xs mt-1">{errors.linkedin}</p>}
                  </div>
                )}

                {job?.requiredLinks?.github?.required && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      GitHub Profile <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.githubLink}
                      onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                        errors.github ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="https://github.com/yourprofile"
                    />
                    {errors.github && <p className="text-red-600 text-xs mt-1">{errors.github}</p>}
                  </div>
                )}

                {job?.requiredLinks?.portfolio?.required && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Portfolio <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioLink}
                      onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                        errors.portfolio ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="https://yourportfolio.com"
                    />
                    {errors.portfolio && <p className="text-red-600 text-xs mt-1">{errors.portfolio}</p>}
                  </div>
                )}

                {job?.requiredLinks?.majorProject?.required && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Major Project <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.majorProjectLink}
                      onChange={(e) => setFormData({ ...formData, majorProjectLink: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                        errors.majorProject ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="https://github.com/yourproject"
                    />
                    {errors.majorProject && <p className="text-red-600 text-xs mt-1">{errors.majorProject}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Custom Questions */}
            {job?.customQuestions && job.customQuestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Screening Questions</h3>

                {job.customQuestions.map((question, idx) => (
                  <div key={question._id}>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      {question.questionText}
                      {question.required && <span className="text-red-600">*</span>}
                    </label>

                    {question.type === 'text' && (
                      <input
                        type="text"
                        value={formData.customAnswers[question._id] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customAnswers: {
                              ...formData.customAnswers,
                              [question._id]: e.target.value,
                            },
                          })
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                          errors[`question_${question._id}`] ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Your answer..."
                      />
                    )}

                    {question.type === 'textarea' && (
                      <textarea
                        value={formData.customAnswers[question._id] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customAnswers: {
                              ...formData.customAnswers,
                              [question._id]: e.target.value,
                            },
                          })
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-none ${
                          errors[`question_${question._id}`] ? 'border-red-300' : 'border-gray-200'
                        }`}
                        rows="3"
                        placeholder="Your answer..."
                      />
                    )}

                    {question.type === 'yes-no' && (
                      <div className="flex gap-3">
                        <label
                          className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition ${
                            formData.customAnswers[question._id] === 'yes'
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                              formData.customAnswers[question._id] === 'yes'
                                ? 'border-emerald-600 bg-emerald-600'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {formData.customAnswers[question._id] === 'yes' && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name={question._id}
                            value="yes"
                            checked={formData.customAnswers[question._id] === 'yes'}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customAnswers: {
                                  ...formData.customAnswers,
                                  [question._id]: e.target.value,
                                },
                              })
                            }
                            className="hidden"
                          />
                          <span className={`font-semibold ${
                            formData.customAnswers[question._id] === 'yes'
                              ? 'text-emerald-700'
                              : 'text-gray-700'
                          }`}>
                            Yes
                          </span>
                        </label>
                        <label
                          className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition ${
                            formData.customAnswers[question._id] === 'no'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-white hover:border-red-300'
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                              formData.customAnswers[question._id] === 'no'
                                ? 'border-red-500 bg-red-500'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {formData.customAnswers[question._id] === 'no' && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name={question._id}
                            value="no"
                            checked={formData.customAnswers[question._id] === 'no'}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customAnswers: {
                                  ...formData.customAnswers,
                                  [question._id]: e.target.value,
                                },
                              })
                            }
                            className="hidden"
                          />
                          <span className={`font-semibold ${
                            formData.customAnswers[question._id] === 'no'
                              ? 'text-red-700'
                              : 'text-gray-700'
                          }`}>
                            No
                          </span>
                        </label>
                      </div>
                    )}

                    {question.type === 'multiple-choice' && (
                      <select
                        value={formData.customAnswers[question._id] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customAnswers: {
                              ...formData.customAnswers,
                              [question._id]: e.target.value,
                            },
                          })
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition ${
                          errors[`question_${question._id}`] ? 'border-red-300' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select an option...</option>
                        {question.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {errors[`question_${question._id}`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`question_${question._id}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyJobModal;
