'use client';

import { FormData } from '../MultiStepForm';

interface EducationBackgroundProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const reservationCategories = ['General', 'OBC', 'SC/ST'];

const EducationBackground = ({ formData, handleChange }: EducationBackgroundProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
      <p className="text-gray-600">Please provide these additional details</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="reservationCategory" className="block text-sm font-medium text-gray-700">
            Reservation Category
          </label>
          <select
            id="reservationCategory"
            value={formData.reservationCategory}
            onChange={handleChange('reservationCategory')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select Category</option>
            {reservationCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="optionalSubject" className="block text-sm font-medium text-gray-700">
            Optional Subject
          </label>
          <input
            type="text"
            id="optionalSubject"
            value={formData.optionalSubject}
            onChange={handleChange('optionalSubject')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Professional Status
          </label>
          <div className="mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isWorkingProfessional"
                checked={formData.isWorkingProfessional}
                onChange={handleChange('isWorkingProfessional')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isWorkingProfessional" className="ml-2 block text-sm text-gray-700">
                I am a working professional
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationBackground; 