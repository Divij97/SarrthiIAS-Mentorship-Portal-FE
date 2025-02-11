'use client';

import { FormData } from '@/components/MultiStepForm';

interface PreparationJourneyProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const PreparationJourney = ({ formData, handleChange }: PreparationJourneyProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">UPSC Preparation Journey</h2>
      <p className="text-gray-600">Tell us about your UPSC preparation experience</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="preliminaryAttempts" className="block text-sm font-medium text-gray-700">
            Number of UPSC Preliminary Examination Attempts
          </label>
          <select
            id="preliminaryAttempts"
            value={formData.preliminaryAttempts}
            onChange={handleChange('preliminaryAttempts')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="0">None</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mainExamAttempts" className="block text-sm font-medium text-gray-700">
            Number of Civil Services Main Examination Attempts
          </label>
          <select
            id="mainExamAttempts"
            value={formData.mainExamAttempts}
            onChange={handleChange('mainExamAttempts')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="0">None</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vajiram and Ravi Student Status
          </label>
          <div className="mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVajiramStudent"
                checked={formData.isVajiramStudent}
                onChange={handleChange('isVajiramStudent')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isVajiramStudent" className="ml-2 block text-sm text-gray-700">
                I am an ex-student of Vajiram and Ravi
              </label>
            </div>
          </div>
        </div>

        {formData.isVajiramStudent && (
          <div>
            <label htmlFor="vajiramCourse" className="block text-sm font-medium text-gray-700">
              Course Enrolled
            </label>
            <input
              type="text"
              id="vajiramCourse"
              value={formData.vajiramCourse || ''}
              onChange={handleChange('vajiramCourse')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreparationJourney; 