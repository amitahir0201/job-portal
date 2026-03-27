import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const StatusTimeline = ({ currentStatus }) => {
  const statusSteps = ['Applied', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Hired'];
  const rejectedSteps = ['Applied', 'Reviewed', 'Rejected'];

  // Determine which timeline to use
  const isRejected = currentStatus === 'Rejected';
  const steps = isRejected ? rejectedSteps : statusSteps;

  // Find current step index
  const currentIndex = steps.indexOf(currentStatus);

  // Special handling for custom statuses
  let statusIndex = currentIndex;
  if (currentStatus === 'Rejected') statusIndex = 2;
  else if (currentStatus === 'Interview Scheduled') statusIndex = 3;
  else if (currentStatus === 'Hired') statusIndex = 4;
  else if (currentStatus === 'Shortlisted') statusIndex = 2;
  else if (currentStatus === 'Reviewed') statusIndex = 1;
  else if (currentStatus === 'New') statusIndex = 0;

  const getStepColor = (index) => {
    if (index < statusIndex) return 'bg-emerald-600 text-white';
    if (index === statusIndex) return isRejected ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white';
    return 'bg-gray-200 text-gray-400';
  };

  const getLineColor = (index) => {
    if (index < statusIndex) return 'bg-emerald-600';
    if (isRejected && index === statusIndex) return 'bg-red-600';
    return 'bg-gray-200';
  };

  return (
    <div className="py-6">
      <h3 className="font-bold text-gray-900 mb-6">Application Timeline</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex-1">
            <div className="flex items-center">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${getStepColor(index)}`}
              >
                {index < statusIndex || (index === statusIndex) ? (
                  <CheckCircle size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </div>

              {/* Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 transition ${getLineColor(index)}`} />
              )}
            </div>
            <p className="text-xs font-semibold text-gray-700 mt-2 text-center">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTimeline;
