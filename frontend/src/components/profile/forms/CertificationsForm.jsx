import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const CertificationsForm = ({ profile, onUpdate, submitting }) => {
  const [certifications, setCertifications] = useState(profile.certifications || []);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialUrl: '',
  });

  const addCertification = () => {
    if (newCert.title && newCert.issuer && newCert.issueDate) {
      setCertifications([...certifications, newCert]);
      setNewCert({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialUrl: '',
      });
    }
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ certifications });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add Certification */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">Add Certification</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newCert.title}
              onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              placeholder="Certification Title *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newCert.issuer}
              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              placeholder="Issuing Organization *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={newCert.issueDate}
              onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
              placeholder="Issue Date *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="date"
              value={newCert.expiryDate}
              onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
              placeholder="Expiry Date (optional)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <input
            type="url"
            value={newCert.credentialUrl}
            onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
            placeholder="Credential URL (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />

          <button
            type="button"
            onClick={addCertification}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Certification
          </button>
        </div>

        {/* Certifications List */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your Certifications ({certifications.length})
          </label>
          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4 py-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{cert.title}</h4>
                    <p className="text-gray-600">{cert.issuer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {certifications.length === 0 && (
            <p className="text-gray-600 text-sm">No certifications added yet</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save Certifications'}
        </button>
      </form>
    </div>
  );
};

export default CertificationsForm;
