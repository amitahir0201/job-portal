import { Link2, Github, Linkedin, FolderOpen } from 'lucide-react';

const LinkOption = ({ icon, label, linkType, value, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-green-600">{icon}</div>
        <label className="font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
      </div>

      <div className="flex items-center gap-6">
        {/* None Option */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={`link-${linkType}`}
            value="none"
            checked={value === 'none'}
            onChange={(e) => onChange(linkType, e.target.value)}
            className="w-4 h-4 text-green-600 accent-green-600"
          />
          <span className="text-sm text-gray-600">None</span>
        </label>

        {/* Required Option */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={`link-${linkType}`}
            value="required"
            checked={value === 'required'}
            onChange={(e) => onChange(linkType, e.target.value)}
            className="w-4 h-4 text-green-600 accent-green-600"
          />
          <span className="text-sm text-gray-600">Required</span>
        </label>

        {/* Optional Option */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={`link-${linkType}`}
            value="optional"
            checked={value === 'optional'}
            onChange={(e) => onChange(linkType, e.target.value)}
            className="w-4 h-4 text-green-600 accent-green-600"
          />
          <span className="text-sm text-gray-600">Optional</span>
        </label>
      </div>
    </div>
  );
};

const RequiredLinksToggle = ({ requiredLinks, onChange }) => {
  const linkOptions = [
    {
      key: 'portfolio',
      label: 'Portfolio',
      icon: <FolderOpen size={20} />,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn Profile',
      icon: <Linkedin size={20} />,
    },
    {
      key: 'github',
      label: 'GitHub Profile',
      icon: <Github size={20} />,
    },
    {
      key: 'majorProject',
      label: 'Major Project',
      icon: <Link2 size={20} />,
    },
  ];

  const handleLinkChange = (linkType, newValue) => {
    onChange(linkType, newValue);
  };

  return (
    <div className="space-y-3">
      {linkOptions.map((option) => (
        <LinkOption
          key={option.key}
          icon={option.icon}
          label={option.label}
          linkType={option.key}
          value={requiredLinks[option.key] || 'none'}
          onChange={handleLinkChange}
        />
      ))}

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Tip:</strong> Select "Required", "Optional", or "None" for each link. Candidates will know what to provide.
        </p>
      </div>
    </div>
  );
};

export default RequiredLinksToggle;
