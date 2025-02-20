'use client';

import { FormData } from '../MultiStepForm';
import { useState } from 'react';

interface CurrentPreparationProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleArrayChange: (field: 'weakSubjects' | 'strongSubjects' | 'preferredSlotsOnWeekdays') => (value: string[]) => void;
}

const timeSlots = {
  MORNING: '9AM_6PM',
  EVENING: '6PM_9PM'
} as const;

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

const answerWritingLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

const commonSubjects = [
  'History',
  'Geography',
  'Polity',
  'Economics',
  'Science & Technology',
  'Environment',
  'Current Affairs',
  'Ethics'
];

const formatTimeSlot = (slot: string): string => {
  return slot === timeSlots.MORNING ? '9:00 AM - 6:00 PM' : '6:00 PM - 9:00 PM';
};

const CurrentPreparation = ({ 
  formData, 
  handleChange,
  handleArrayChange 
}: CurrentPreparationProps) => {
  const [useUniformSlot, setUseUniformSlot] = useState(true);
  const [uniformSlot, setUniformSlot] = useState('');

  const handleUniformSlotChange = (slot: string) => {
    setUniformSlot(slot);
    const newSlots = weekDays.map(() => slot);
    handleArrayChange('preferredSlotsOnWeekdays')(newSlots);
  };

  const handleDayWiseSlotChange = (day: number, slot: string) => {
    const newSlots = [...formData.preferredSlotsOnWeekdays];
    newSlots[day] = slot;
    handleArrayChange('preferredSlotsOnWeekdays')(newSlots);
  };

  const handleSlotTypeChange = (isUniform: boolean) => {
    setUseUniformSlot(isUniform);
    // Reset slots when switching between uniform and day-wise
    handleArrayChange('preferredSlotsOnWeekdays')([]);
    setUniformSlot('');
  };

  const handleSubjectsChange = (field: 'weakSubjects' | 'strongSubjects') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const subjects = e.target.value
      .split(',')
      .map(subject => subject.trim())
      .filter(subject => subject !== '');
    handleArrayChange(field)(subjects);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Current Preparation Details</h2>
      <p className="text-gray-600">Tell us about your current preparation status and preferences</p>

      <div className="space-y-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Preferred Time Slots
          </label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="uniform-slot"
                checked={useUniformSlot}
                onChange={() => handleSlotTypeChange(true)}
                className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="uniform-slot" className="text-sm text-gray-700">
                Same time slot for all weekdays
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="day-wise-slot"
                checked={!useUniformSlot}
                onChange={() => handleSlotTypeChange(false)}
                className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="day-wise-slot" className="text-sm text-gray-700">
                Different time slots for each day
              </label>
            </div>
          </div>

          {useUniformSlot ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="morning-slot"
                  checked={uniformSlot === timeSlots.MORNING}
                  onChange={() => handleUniformSlotChange(timeSlots.MORNING)}
                  className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="morning-slot" className="text-sm text-gray-700">
                  {formatTimeSlot(timeSlots.MORNING)}
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="evening-slot"
                  checked={uniformSlot === timeSlots.EVENING}
                  onChange={() => handleUniformSlotChange(timeSlots.EVENING)}
                  className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="evening-slot" className="text-sm text-gray-700">
                  {formatTimeSlot(timeSlots.EVENING)}
                </label>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {weekDays.map((day, index) => (
                <div key={day} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">{day}</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id={`${day}-morning`}
                      checked={formData.preferredSlotsOnWeekdays[index] === timeSlots.MORNING}
                      onChange={() => handleDayWiseSlotChange(index, timeSlots.MORNING)}
                      className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor={`${day}-morning`} className="text-sm text-gray-700">
                      {formatTimeSlot(timeSlots.MORNING)}
                    </label>
                    <input
                      type="radio"
                      id={`${day}-evening`}
                      checked={formData.preferredSlotsOnWeekdays[index] === timeSlots.EVENING}
                      onChange={() => handleDayWiseSlotChange(index, timeSlots.EVENING)}
                      className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor={`${day}-evening`} className="text-sm text-gray-700">
                      {formatTimeSlot(timeSlots.EVENING)}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="answerWritingLevel" className="block text-sm font-medium text-gray-700">
            Answer Writing Level
          </label>
          <select
            id="answerWritingLevel"
            value={formData.answerWritingLevel}
            onChange={handleChange('answerWritingLevel')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select Level</option>
            {answerWritingLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="weakSubjects" className="block text-sm font-medium text-gray-700">
            Weak Subjects
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Enter subjects separated by commas (e.g., History, Science & Technology, Economics)
          </p>
          <input
            type="text"
            id="weakSubjects"
            value={formData.weakSubjects.join(', ')}
            onChange={handleSubjectsChange('weakSubjects')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., History, Science & Technology, Economics"
          />
        </div>

        <div>
          <label htmlFor="strongSubjects" className="block text-sm font-medium text-gray-700">
            Strong Subjects
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Enter subjects separated by commas (e.g., Polity, Geography, Ethics)
          </p>
          <input
            type="text"
            id="strongSubjects"
            value={formData.strongSubjects.join(', ')}
            onChange={handleSubjectsChange('strongSubjects')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Polity, Geography, Ethics"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentPreparation; 