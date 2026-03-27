import { Calendar, AlertCircle, Keyboard, MousePointer2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const DateInputField = ({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  minDate,
  label = 'Date',
  name = 'date',
  showIcon = true,
  description = '',
  isRequired = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Sync manual input with external value if needed
  useEffect(() => {
    if (value && !showManualInput) {
      setInputValue(formatDateToDisplay(value));
    }
  }, [value, showManualInput]);

  const formatDateToDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      if (dateString.includes('-') && dateString.length === 10) {
        const [year, month, day] = dateString.split('-');
        return `${month}-${day}-${year}`;
      }
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
      }
    } catch (e) {
      return dateString;
    }
  };

  const parseDisplayDateToISO = (displayDate) => {
    const digits = displayDate.replace(/[^\d]/g, '');
    if (digits.length !== 8) throw new Error('Incomplete date');

    const month = digits.slice(0, 2);
    const day = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) throw new Error('Invalid Month (01-12)');
    if (dayNum < 1 || dayNum > 31) throw new Error('Invalid Day (01-31)');
    if (yearNum < 1900 || yearNum > 2100) throw new Error('Year must be 1900-2100');

    const isoDate = `${year}-${month}-${day}`;
    const dateObj = new Date(isoDate + 'T00:00:00Z');
    if (dateObj.toISOString().split('T')[0] !== isoDate) {
      throw new Error('This calendar date does not exist');
    }

    return isoDate;
  };

  const handleManualInput = (e) => {
    let input = e.target.value;
    const digits = input.replace(/[^\d]/g, '').slice(0, 8);
    
    let formatted = '';
    if (digits.length > 0) {
      formatted += digits.slice(0, 2);
      if (digits.length > 2) {
        formatted += '-' + digits.slice(2, 4);
        if (digits.length > 4) {
          formatted += '-' + digits.slice(4, 8);
        }
      }
    }

    setInputValue(formatted);

    if (digits.length === 8) {
      try {
        const isoDate = parseDisplayDateToISO(formatted);
        if (minDate && new Date(isoDate) < new Date(minDate)) return;
        onChange({ target: { name, value: isoDate } });
      } catch (err) {}
    }
  };

  const handleManualInputBlur = () => {
    if (inputValue.length > 0) {
      try {
        const isoDate = parseDisplayDateToISO(inputValue);
        onChange({ target: { name, value: isoDate } });
      } catch (err) {
        console.error('Validation Error');
      }
    }
    if (onBlur) onBlur({ target: { name } });
  };

  return (
    <div className="w-full max-w-full md:max-w-md lg:max-w-lg mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <label className="block text-sm font-bold text-gray-800">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        
        {/* Toggle Switch inside label row for better mobile spacing */}
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
        >
          {showManualInput ? (
            <><MousePointer2 size={12} /> Picker</>
          ) : (
            <><Keyboard size={12} /> Manual Input</>
          )}
        </button>
      </div>

      <div className="relative group">
        {!showManualInput ? (
          <div className="relative w-full">
            {showIcon && (
              <Calendar 
                size={18} 
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 z-10 transition-colors ${
                  error && touched ? 'text-red-500' : 'text-green-600 group-focus-within:text-green-500'
                }`} 
              />
            )}
            <input
              type="date"
              name={name}
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
              min={minDate || new Date().toISOString().split('T')[0]}
              className={`w-full appearance-none bg-white ${showIcon ? 'pl-11' : 'px-4'} pr-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none text-base sm:text-sm ${
                error && touched ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-gray-200'
              }`}
            />
          </div>
        ) : (
          <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
             <Keyboard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600 z-10" />
            <input
              type="text"
              placeholder="MM-DD-YYYY"
              value={inputValue}
              onChange={handleManualInput}
              onBlur={handleManualInputBlur}
              inputMode="numeric"
              autoFocus
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none font-mono tracking-wider text-base sm:text-sm ${
                error && touched ? 'border-red-300 bg-red-50' : 'border-green-100 bg-white'
              }`}
            />
          </div>
        )}
      </div>

      {/* Helper Messages Area - Fixed height to prevent layout shift */}
      <div className="min-h-[24px] mt-1.5 px-1">
        {error && touched ? (
          <p className="text-red-500 text-xs flex items-center gap-1 font-semibold animate-in slide-in-from-left-1 duration-200">
            <AlertCircle size={14} /> {error}
          </p>
        ) : (
          <>
            {showManualInput && (
               <p className="text-[10px] text-gray-500 font-medium">Just type digits (e.g. 05202026)</p>
            )}
            {description && !showManualInput && (
              <p className="text-gray-400 text-[11px] italic">{description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DateInputField;