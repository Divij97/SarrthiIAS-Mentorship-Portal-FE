'use client';

import { FormData } from '@/types/multistep-form';
import { FormErrors } from '@/utils/mentee-signup-form-validator';

interface ExpectationsProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  errors?: FormErrors;
}

const currentAffairsSources = [
  'Newspaper',
  'Online News Portals',
  'Current Affairs Magazines',
  'YouTube Channels',
  'Multiple Sources'
];

const Expectations = ({ formData, handleChange }: ExpectationsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Program Expectations</h2>
      <p className="text-gray-600">Help us understand your background and expectations</p>
      <p className="text-sm font-medium text-red-600">* Marked fields are required</p>

      <div className="space-y-6">
        <div>
          <label htmlFor="previouslyEnrolledCourses" className="block text-sm font-medium text-gray-700">
            Previous Course Enrollment
          </label>
          <p className="text-sm text-gray-500 mb-2">
            If you have previously enrolled in any of our courses, please specify them below
          </p>
          <input
            type="text"
            id="previouslyEnrolledCourses"
            value={formData.previouslyEnrolledCourses}
            onChange={handleChange('previouslyEnrolledCourses')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., GS Foundation Course 2023, Answer Writing Program, etc."
          />
        </div>

        <div>
          <label htmlFor="currentAffairsSource" className="block text-sm font-medium text-gray-700">
            Primary Source for Current Affairs <span className="text-red-600">*</span>
          </label>
          <select
            id="currentAffairsSource"
            value={formData.currentAffairsSource}
            onChange={handleChange('currentAffairsSource')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          >
            {currentAffairsSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="expectations" className="block text-sm font-medium text-gray-700">
            Expectations from this Program
          </label>
          <textarea
            id="expectations"
            value={formData.expectations}
            onChange={handleChange('expectations')}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Please share what you hope to achieve through this mentorship program..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Summary of Your Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Personal Details:</strong> {formData.name} ({formData.email})</p>
            <p><strong>Region:</strong> {formData.region}</p>
            <p><strong>Reservation Category:</strong> {formData.reservationCategory}</p>
            <p><strong>UPSC Attempts:</strong> Prelims: {formData.preliminaryAttempts}, Mains: {formData.mainExamAttempts}</p>
            <p><strong>Answer Writing Level:</strong> {formData.answerWritingLevel}</p>
            <p><strong>Current Affairs Source:</strong> {formData.currentAffairsSource}</p>
            <div>
              <strong>Strong Subjects:</strong>{' '}
              {formData.strongSubjects.join(', ')}
            </div>
            <div>
              <strong>Areas for Improvement:</strong>{' '}
              {formData.weakSubjects.join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expectations; 