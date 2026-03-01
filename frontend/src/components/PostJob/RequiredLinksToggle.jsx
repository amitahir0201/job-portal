import { Link2, Github, Linkedin, FolderOpen } from 'lucide-react';

const LinkOption = ({ icon, label, linkType, value, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors gap-4">
      {/* Left Side: Icon and Label */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-green-600 shrink-0">{icon}</div>
        <label className="font-semibold text-gray-900 truncate cursor-pointer">
          {label}
        </label>
      </div>

      {/* Right Side: Radio Options Container */}
      {/* We use a 3-column grid on mobile to ensure they stay inside the box */}
      <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-green-100">
        
        {/* None Option */}
        <label className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`link-${linkType}`}
            value="none"
            checked={value === 'none'}
            onChange={(e) => onChange(linkType, e.target.value)}
            className="w-4 h-4 text-green-600 accent-green-600 cursor-pointer"
          />
          <span className="text-[11px] sm:text-sm text-gray-600 group-hover:text-green-700">None</span>
        </label>

        {/* Required Option */}
        <label className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`link-${linkType}`}
            value="required"
            checked={value === 'required'}
            onChange={(e) => onChange(linkType, e.target.value)}
            className="w-4 h-4 text-green-600 accent-green-600 cursor-pointer"
          />
          <span className="text-[11px] sm:text-sm text-gray-600 group-hover:text-green-700">Required</span>
        </label>

        {/* Optional Option */}
        <label className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`link-${linkType}`}
            value="optional"
            checked={value === 'optional'}
            onChange={(e) => onChange(linkType, e.target.value)}
            className="w-4 h-4 text-green-600 accent-green-600 cursor-pointer"
          />
          <span className="text-[11px] sm:text-sm text-gray-600 group-hover:text-green-700">Optional</span>
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
    <div className="w-full space-y-3 overflow-hidden">
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

      <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
        <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
          <span className="font-bold">Tip:</span> Select how candidates should provide these links. 
          "Required" forces a link, while "Optional" allows them to skip it.
        </p>
      </div>
    </div>
  );
};

export default RequiredLinksToggle;