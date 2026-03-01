import { AlertCircle, X } from 'lucide-react';

const ErrorModal = ({ isOpen, error, onClose, title = 'Error Occurred' }) => {
  if (!isOpen || !error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 flex items-start justify-between rounded-t-2xl">
          <div className="flex items-start gap-4">
            <AlertCircle size={28} className="text-white flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-700 rounded-full p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm sm:text-base font-medium leading-relaxed">
              {typeof error === 'object' ? error.message || JSON.stringify(error) : error}
            </p>
          </div>

          {/* Error Code (if available) */}
          {typeof error === 'object' && error.code && (
            <div className="mt-4 bg-gray-100 rounded p-3">
              <p className="text-xs text-gray-600 font-mono">
                Error Code: <span className="font-bold text-gray-900">{error.code}</span>
              </p>
            </div>
          )}

          {/* Details (if available) */}
          {typeof error === 'object' && error.details && (
            <div className="mt-4 bg-gray-100 rounded p-3">
              <p className="text-xs text-gray-700 font-medium mb-2">Details:</p>
              <p className="text-xs text-gray-600">{error.details}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
