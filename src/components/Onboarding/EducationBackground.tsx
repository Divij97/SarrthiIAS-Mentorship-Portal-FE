'use client';

import { FormData } from '../MultiStepForm';

interface EducationBackgroundProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const graduationSubjects = [
  'Computer Science',
  'Engineering',
  'Arts',
  'Commerce',
  'Science',
  'Law',
  'Medicine',
  'Other'
];

const EducationBackground = ({ formData, handleChange }: EducationBackgroundProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Educational Background</h2>
      <p className="text-gray-600">Tell us about your educational journey</p>

      <div className="space-y-4">
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

        <div>
          <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">
            Name of College
          </label>
          <input
            type="text"
            id="collegeName"
            value={formData.collegeName}
            onChange={handleChange('collegeName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="graduationSubject" className="block text-sm font-medium text-gray-700">
            Subject of Graduation
          </label>
          <select
            id="graduationSubject"
            value={formData.graduationSubject}
            onChange={handleChange('graduationSubject')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select Subject</option>
            {graduationSubjects.map((subject) => (
              <option key={subject} value={subject.toLowerCase()}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EducationBackground; 