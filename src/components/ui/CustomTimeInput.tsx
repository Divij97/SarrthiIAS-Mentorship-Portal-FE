import { useState, useEffect, useRef } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface CustomTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
}

export function CustomTimeInput({
  value,
  onChange,
  disabled = false,
  required = false,
  id = 'time-input',
  className = '',
}: CustomTimeInputProps) {
  const [hours, setHours] = useState<string>('12');
  const [minutes, setMinutes] = useState<string>('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [isOpen, setIsOpen] = useState(false);
  const prevValueRef = useRef<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24: string): { hours: string; minutes: string; period: 'AM' | 'PM' } => {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    return {
      hours: hour === 0 ? '12' : (hour > 12 ? (hour - 12).toString().padStart(2, '0') : h),
      minutes: m,
      period: hour >= 12 ? 'PM' : 'AM'
    };
  };

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (hours: string, minutes: string, period: 'AM' | 'PM') => {
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  // Initialize values from the input value
  useEffect(() => {
    if (value && value !== prevValueRef.current) {
      const { hours: h, minutes: m, period: p } = convertTo12Hour(value);
      setHours(h);
      setMinutes(m);
      setPeriod(p);
      prevValueRef.current = value;
    }
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = e.target.value;
    setHours(newHours);
    onChange(convertTo24Hour(newHours, minutes, period));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = e.target.value;
    setMinutes(newMinutes);
    onChange(convertTo24Hour(hours, newMinutes, period));
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as 'AM' | 'PM';
    setPeriod(newPeriod as 'AM' | 'PM');
    onChange(convertTo24Hour(hours, minutes, newPeriod));
  };

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minuteOptions = ['00', '15', '30', '45'];

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ClockIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          id={id}
          value={`${hours}:${minutes} ${period}`}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${className}`}
          disabled={disabled}
          required={required}
        />
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-2">
          <div className="flex space-x-2">
            <select
              value={hours}
              onChange={handleHourChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              autoFocus
            >
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <span className="flex items-center">:</span>
            <select
              value={minutes}
              onChange={handleMinuteChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              {minuteOptions.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
            <select
              value={period}
              onChange={handlePeriodChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 