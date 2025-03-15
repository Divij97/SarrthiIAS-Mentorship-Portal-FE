'use client';

import { FormErrors, MentorFormData } from '@/components/MentorSignUp/types';

interface AvailabilityStepProps {
  formData: MentorFormData;
  dayOfWeekOptions: string[];
  handleArrayChange: (field: string) => (value: string[]) => void;
  errors: FormErrors;
}

export default function AvailabilityStep({ formData, dayOfWeekOptions, handleArrayChange, errors }: AvailabilityStepProps) {
  const toggleDay = (day: string) => {
    const currentDays = [...formData.offDaysOfWeek];
    const index = currentDays.indexOf(day);
    
    if (index === -1) {
      // Add the day
      handleArrayChange('offDaysOfWeek')([...currentDays, day]);
    } else {
      // Remove the day
      currentDays.splice(index, 1);
      handleArrayChange('offDaysOfWeek')(currentDays);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Availability</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select your off days (days you are not available for mentoring)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {dayOfWeekOptions.map((day) => (
            <div key={day} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={`day-${day}`}
                  type="checkbox"
                  checked={formData.offDaysOfWeek.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`day-${day}`} className="font-medium text-gray-700">
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </label>
              </div>
            </div>
          ))}
        </div>
        {errors.offDaysOfWeek && (
          <p className="mt-2 text-sm text-red-600">{errors.offDaysOfWeek}</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Your Availability Summary</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          {formData.offDaysOfWeek.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600">
                You will be <span className="font-semibold">unavailable</span> on:
              </p>
              <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                {formData.offDaysOfWeek.map((day: string) => (
                  <li key={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                You will be <span className="font-semibold">available</span> for mentoring on all other days.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              You haven't selected any off days. This means you'll be available for mentoring all days of the week.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 