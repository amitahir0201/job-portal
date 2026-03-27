import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ interviewDate, interviewTime, status }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerClass, setTimerClass] = useState('');

  useEffect(() => {
    if (status !== 'Scheduled' && status !== 'Confirmed') {
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const interviewDateTime = new Date(`${interviewDate}T${interviewTime}`);
      const difference = interviewDateTime - now;

      if (difference <= 0) {
        return { isLive: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { isLive: false, days, hours, minutes, seconds };
    };

    const updateTimer = () => {
      const time = calculateTimeLeft();
      setTimeLeft(time);

      // Set urgency class
      if (time.isLive) {
        setTimerClass('bg-red-50 border-red-200');
      } else if (time.days === 0 && time.hours <= 2) {
        setTimerClass('bg-orange-50 border-orange-200');
      } else if (time.days === 0) {
        setTimerClass('bg-yellow-50 border-yellow-200');
      } else {
        setTimerClass('bg-blue-50 border-blue-200');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [interviewDate, interviewTime, status]);

  if (!timeLeft || (status !== 'Scheduled' && status !== 'Confirmed')) {
    return null;
  }

  if (timeLeft.isLive) {
    return (
      <div className={`p-4 rounded-lg border-2 ${timerClass} animate-pulse`}>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} className="text-red-600 animate-bounce" />
          <span className="font-bold text-red-900">Interview is happening NOW!</span>
        </div>
        <p className="text-sm text-red-700">Join the meeting immediately</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${timerClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={18} className="text-gray-700" />
        <span className="font-semibold text-gray-900">Interview starts in</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="text-center bg-white rounded-lg p-2 sm:p-3">
          <div className="text-xl sm:text-2xl font-bold text-[#0ea5e9]">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Days</div>
        </div>
        <div className="text-center bg-white rounded-lg p-2 sm:p-3">
          <div className="text-xl sm:text-2xl font-bold text-[#06b6d4]">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Hours</div>
        </div>
        <div className="text-center bg-white rounded-lg p-2 sm:p-3">
          <div className="text-xl sm:text-2xl font-bold text-[#10b981]">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Mins</div>
        </div>
        <div className="text-center bg-white rounded-lg p-2 sm:p-3">
          <div className="text-xl sm:text-2xl font-bold text-[#f59e0b]">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Secs</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
