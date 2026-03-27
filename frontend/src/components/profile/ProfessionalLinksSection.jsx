import React from 'react';
import { ExternalLink, Github, Globe, Linkedin } from 'lucide-react';

const ProfessionalLinksSection = ({ profile = {} }) => {
  const links = [
    {
      label: 'Portfolio',
      url: profile.portfolioUrl,
      icon: Globe,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    },
    {
      label: 'LinkedIn',
      url: profile.linkedinUrl,
      icon: Linkedin,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    {
      label: 'GitHub',
      url: profile.githubUrl,
      icon: Github,
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    },
    {
      label: 'Major Project',
      url: profile.majorProjectLink,
      icon: Globe,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    },
  ];

  const activeLinks = links.filter((link) => link.url);

  if (activeLinks.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 rounded-lg ${link.color} transition-colors`}
            >
              <IconComponent size={20} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                <p className="text-xs opacity-75 truncate">{link.url}</p>
              </div>
              <ExternalLink size={16} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalLinksSection;
