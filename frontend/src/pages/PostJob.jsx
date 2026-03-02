import { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  Code,
  Clock,
  Link2,
} from 'lucide-react';
import RecruiterLayout from '../layouts/RecruiterLayout';
import SectionCard from '../components/PostJob/SectionCard';
import SkillsInput from '../components/PostJob/SkillsInput';
import CustomQuestionBuilder from '../components/PostJob/CustomQuestionBuilder';
import RequiredLinksToggle from '../components/PostJob/RequiredLinksToggle';
import DateInputField from '../components/PostJob/DateInputField';
import api from '../services/api';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    jobType: 'Full-Time',
    experienceLevel: 'Mid',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    requiredSkills: [],
    applicationDeadline: '',
    customQuestions: [],
    requiredLinks: {
      portfolio: 'none',
      linkedin: 'none',
      github: 'none',
      majorProject: 'none',
    },
    status: 'Draft',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (formData.salaryMin && formData.salaryMax && formData.salaryMin > formData.salaryMax) {
      newErrors.salary = 'Minimum salary cannot exceed maximum salary';
    }

    if (formData.applicationDeadline) {
      try {
        const deadline = new Date(formData.applicationDeadline + 'T00:00:00Z');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (deadline < today) {
          newErrors.applicationDeadline = 'Deadline cannot be in the past';
        }
      } catch (err) {
        newErrors.applicationDeadline = 'Invalid date format. Please use MM-DD-YYYY format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle blur for touched fields
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Handle skills
  const handleAddSkill = (skill) => {
    if (skill.trim() && !formData.requiredSkills.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill.trim()],
      }));
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index),
    }));
  };

  // Handle custom questions
  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: [
        ...prev.customQuestions,
        {
          questionText: '',
          type: 'text',
          options: [],
          required: false,
        },
      ],
    }));
  };

  const handleUpdateQuestion = (index, updatedQuestion) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions.map((q, i) => (i === index ? updatedQuestion : q)),
    }));
  };

  const handleRemoveQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== index),
    }));
  };

  // Handle required links
  const handleUpdateRequiredLinks = (linkType, value) => {
    setFormData((prev) => ({
      ...prev,
      requiredLinks: {
        ...prev.requiredLinks,
        [linkType]: value,
      },
    }));
  };

  // Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Draft submission
  const handleSaveDraft = async () => {
    setFormData((prev) => ({
      ...prev,
      status: 'Draft',
    }));
    await handleSubmit(true);
  };

  // Publish job
  const handlePublish = async () => {
    if (!validateForm()) {
      showToast('Please fix all errors before publishing', 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      status: 'Active',
    }));
    await handleSubmit(false);
  };

  // Submit form
  const handleSubmit = async (isDraft = false) => {
    try {
      setLoading(true);
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        company: user.companyName || 'Your Company',
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : 0,
        currency: formData.currency,
        requiredSkills: formData.requiredSkills,
        applicationDeadline: formData.applicationDeadline || null,
        customQuestions: formData.customQuestions,
        requiredLinks: formData.requiredLinks,
        status: isDraft ? 'Draft' : 'Active',
      };

      const response = await api.post('/jobs', payload);

      if (response.data.success) {
        showToast(isDraft ? 'Job saved as draft!' : 'Job published successfully!', 'success');
        // Reset form or redirect
        setFormData({
          title: '',
          location: '',
          jobType: 'Full-Time',
          experienceLevel: 'Mid',
          salaryMin: '',
          salaryMax: '',
          currency: 'USD',
          description: '',
          requiredSkills: [],
          applicationDeadline: '',
          customQuestions: [],
          requiredLinks: {
            portfolio: 'none',
            linkedin: 'none',
            github: 'none',
            majorProject: 'none',
          },
          status: 'Draft',
        });
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error submitting job', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-4 sm:py-6 md:py-8 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-2 right-2 sm:top-4 sm:right-4 p-2.5 sm:p-4 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm ${
              toast.type === 'success'
                ? 'bg-green-600 text-white border border-green-700'
                : 'bg-red-600 text-white border border-red-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            )}
            <span className="line-clamp-2">{toast.message}</span>
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8 px-1 sm:px-2">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              Post a New Job
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Fill in the details below to create and publish a job posting
            </p>
          </div>

          {/* Main Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 pb-24 sm:pb-28 md:pb-32">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
              {/* Basic Information */}
              <SectionCard
                title="Basic Information"
                icon={<Briefcase size={18} className="sm:w-5 sm:h-5" />}
                description="Essential job details"
              >
                <div className="space-y-3 md:space-y-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="e.g., Senior React Developer"
                      className={`w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white ${
                        errors.title && touched.title
                          ? 'border-red-500 bg-red-50'
                          : 'border-green-300 hover:border-green-400'
                      }`}
                    />
                    {errors.title && touched.title && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                      Location *
                    </label>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <MapPin size={16} className="text-green-600 flex-shrink-0 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g., San Francisco, CA"
                        className={`flex-1 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white ${
                          errors.location && touched.location
                            ? 'border-red-500 bg-red-50'
                            : 'border-green-300 hover:border-green-400'
                        }`}
                      />
                    </div>
                    {errors.location && touched.location && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Job Type & Experience Level */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Job Type
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white font-medium"
                      >
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                        <option>Remote</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Experience
                      </label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white font-medium"
                      >
                        <option>Entry</option>
                        <option>Mid</option>
                        <option>Senior</option>
                        <option>Lead</option>
                      </select>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Salary Information */}
              <SectionCard
                title="Salary Information"
                icon={<DollarSign size={18} className="sm:w-5 sm:h-5" />}
                description="Optional - Leave blank if not disclosing"
              >
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Min Salary
                      </label>
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleInputChange}
                        placeholder="50000"
                        className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Max Salary
                      </label>
                      <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleInputChange}
                        placeholder="100000"
                        className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white font-medium"
                      >
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>INR</option>
                      </select>
                    </div>
                  </div>
                  {errors.salary && touched.salaryMin && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.salary}
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* Job Description */}
              <SectionCard
                title="Job Description"
                icon={<Code size={18} className="sm:w-5 sm:h-5" />}
                description="Provide detailed information about the role"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Describe the job role, responsibilities, and what you're looking for..."
                    rows="5"
                    className={`w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all resize-none font-medium bg-white md:rows-8 ${
                      errors.description && touched.description
                        ? 'border-red-500 bg-red-50'
                        : 'border-green-300 hover:border-green-400'
                    }`}
                  />
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mt-1.5 sm:mt-2 gap-1.5 sm:gap-2">
                    <div>
                      {errors.description && touched.description && (
                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                          <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.description}
                        </p>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {formData.description.length} / 5000
                    </p>
                  </div>
                </div>
              </SectionCard>

              {/* Required Skills */}
              <SectionCard
                title="Required Skills"
                icon={<Code size={18} className="sm:w-5 sm:h-5" />}
                description="Add skills required for this position"
              >
                <SkillsInput
                  skills={formData.requiredSkills}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                />
              </SectionCard>

              {/* Application Deadline */}
              <SectionCard
                title="Application Deadline"
                icon={<Calendar size={18} className="sm:w-5 sm:h-5" />}
                description="When should applications close?"
              >
                <DateInputField
                  name="applicationDeadline"
                  label="Deadline (Optional)"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.applicationDeadline}
                  touched={touched.applicationDeadline}
                  minDate={new Date().toISOString().split('T')[0]}
                  showIcon={true}
                  description="You can accept both MM-DD-YYYY and MM/DD/YYYY formats. On mobile, you can also type manually with auto-formatting."
                />
              </SectionCard>

              {/* Required Links */}
              <SectionCard
                title="Required Links"
                icon={<Link2 size={18} className="sm:w-5 sm:h-5" />}
                description="Which documents should applicants provide?"
              >
                <RequiredLinksToggle
                  requiredLinks={formData.requiredLinks}
                  onChange={handleUpdateRequiredLinks}
                />
              </SectionCard>

              {/* Custom Questions */}
              <SectionCard
                title="Custom Questions"
                icon={<Clock size={18} className="sm:w-5 sm:h-5" />}
                description="Add screening questions for applicants"
              >
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {formData.customQuestions.map((question, index) => (
                    <CustomQuestionBuilder
                      key={index}
                      question={question}
                      index={index}
                      onChange={(updatedQuestion) =>
                        handleUpdateQuestion(index, updatedQuestion)
                      }
                      onRemove={() => handleRemoveQuestion(index)}
                    />
                  ))}

                  <button
                    onClick={handleAddQuestion}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-3 sm:px-4 border-2 border-dashed border-green-400 rounded-lg text-xs sm:text-sm md:text-base text-green-600 hover:bg-green-50 transition-colors font-semibold"
                  >
                    <Plus size={16} className="sm:w-5 sm:h-5" />
                    Add Question
                  </button>
                </div>
              </SectionCard>

              {/* Job Status */}
              {/* <SectionCard
                title="Job Status"
                icon={<Briefcase size={18} className="sm:w-5 sm:h-5" />}
                description="Save as draft or publish immediately"
              >
                <div className="space-y-2 sm:space-y-3 md:space-y-3">
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2 sm:p-3 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Draft"
                      checked={formData.status === 'Draft'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                    <div>
                      <p className="font-medium text-xs sm:text-sm md:text-base text-gray-900">Save as Draft</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        You can publish this job later
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2 sm:p-3 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                    <div>
                      <p className="font-medium text-xs sm:text-sm md:text-base text-gray-900">Publish Now</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Job will be visible to job seekers immediately
                      </p>
                    </div>
                  </label>
                </div>
              </SectionCard> */}
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-4 h-fit">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md lg:shadow-lg p-3 sm:p-4 md:p-6 border-2 lg:border border-green-200">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                  Job Summary
                </h3>

                <div className="space-y-1.5 sm:space-y-2 md:space-y-3 text-xs sm:text-sm">
                  {formData.title && (
                    <div>
                      <p className="text-green-600 font-semibold text-xs">Title</p>
                      <p className="font-medium text-gray-900 truncate text-xs sm:text-sm">
                        {formData.title}
                      </p>
                    </div>
                  )}

                  {formData.location && (
                    <div>
                      <p className="text-green-600 font-semibold text-xs">Location</p>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">
                        {formData.location}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-green-600 font-semibold text-xs">Job Type</p>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">{formData.jobType}</p>
                  </div>

                  <div>
                    <p className="text-green-600 font-semibold text-xs">Experience</p>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">
                      {formData.experienceLevel}
                    </p>
                  </div>

                  {(formData.salaryMin || formData.salaryMax) && (
                    <div>
                      <p className="text-green-600 font-semibold text-xs">Salary</p>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">
                        {formData.salaryMin && `${formData.currency} ${formData.salaryMin}`}
                        {formData.salaryMin && formData.salaryMax && ' - '}
                        {formData.salaryMax && `${formData.currency} ${formData.salaryMax}`}
                      </p>
                    </div>
                  )}

                  {formData.requiredSkills.length > 0 && (
                    <div>
                      <p className="text-green-600 font-semibold text-xs">Skills</p>
                      <div className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-2 mt-0.5 sm:mt-1 md:mt-2">
                        {formData.requiredSkills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                        {formData.requiredSkills.length > 2 && (
                          <span className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            +{formData.requiredSkills.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.applicationDeadline && (
                    <div>
                      <p className="text-green-600 font-semibold text-xs">Deadline</p>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">
                        {formData.applicationDeadline && (() => {
                          const [year, month, day] = formData.applicationDeadline.split('-');
                          return `${month}-${day}-${year}`;
                        })()}
                      </p>
                    </div>
                  )}

                  <div className="pt-1.5 sm:pt-2 md:pt-4 border-t border-green-200">
                    <p className="text-green-600 font-semibold mb-0.5 sm:mb-1 md:mb-2 text-xs">Status</p>
                    <span
                      className={`inline-block px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold ${
                        formData.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 lg:border-t border-green-200 shadow-lg lg:shadow-2xl z-40">
            <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 flex flex-col-reverse xs:flex-row gap-2 sm:gap-2.5 md:gap-3 justify-end">
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 border-2 border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xs sm:text-sm md:text-base"
              >
                <Save size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="hidden xs:inline">Save Draft</span>
                <span className="xs:hidden">Draft</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
              >
                <Send size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                {loading ? (
                  <span className="hidden sm:inline">Publishing...</span>
                ) : (
                  <>
                    <span className="hidden xs:inline">Publish Job</span>
                    <span className="xs:hidden">Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default PostJob;
