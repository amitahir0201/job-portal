import React from 'react';
import { Award, Calendar } from 'lucide-react';

const CertificationsSection = ({ certifications = [] }) => {
  if (!certifications || certifications.length === 0) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Award size={24} className="text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
      </div>
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors"
          >
            <h3 className="text-lg font-bold text-gray-900">{cert.title}</h3>
            <p className="text-gray-700 font-semibold mt-1">{cert.issuer}</p>

            {cert.issueDate && (
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <Calendar size={16} />
                <span>
                  Issued {formatDate(cert.issueDate)}
                  {cert.expiryDate && ` · Expires ${formatDate(cert.expiryDate)}`}
                </span>
              </div>
            )}

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
              >
                View Credential →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsSection;
