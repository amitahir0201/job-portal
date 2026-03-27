import React, { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { getFullImageUrl } from '../../../utils/imageUtils';
import api from '../../../services/api';

const ResumeUploadForm = ({ profile, onUpdate, submitting }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeURL, setResumeURL] = useState(profile.resumeURL || '');

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      // Create a preview URL for UI only, don't save this to backend
      const url = URL.createObjectURL(file);
      setResumeURL(url);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (resumeFile) {
      try {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        const res = await api.post('/profile/resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (res.data.success) {
          onUpdate({ resumeURL: res.data.resumeURL });
          setResumeFile(null);
        }
      } catch (err) {
        console.error('Error uploading resume:', err);
        alert(err.response?.data?.message || 'Failed to upload resume');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume/CV</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Resume */}
        {profile.resumeURL && !resumeFile && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="text-emerald-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Resume Uploaded</p>
                  <a
                    href={profile.resumeURL.startsWith('blob:') ? profile.resumeURL : getFullImageUrl(profile.resumeURL)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline text-sm"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Resume Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Upload New Resume (PDF)
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-emerald-500 transition">
            <Upload className="text-gray-400 mb-2" size={32} />
            <span className="text-gray-700 font-semibold">Click to upload or drag and drop</span>
            <span className="text-gray-600 text-sm mt-1">PDF (Max 10MB)</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="hidden"
            />
          </label>
          {resumeFile && (
            <p className="text-sm text-emerald-600 font-semibold mt-2">
              File selected: {resumeFile.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !resumeFile}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>

      <p className="text-xs text-gray-600 mt-4">
        Note: In the production environment, the resume will be uploaded to cloud storage and a shareable link will be generated.
      </p>
    </div>
  );
};

export default ResumeUploadForm;
