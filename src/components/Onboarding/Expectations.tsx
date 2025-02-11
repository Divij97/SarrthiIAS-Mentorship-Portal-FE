'use client';

import { FormData } from '../MultiStepForm';

interface ExpectationsProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

const Expectations = ({ formData, handleChange }: ExpectationsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Program Expectations</h2>
      <p className="text-gray-600">Tell us what you hope to achieve through this mentorship program</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="expectations" className="block text-sm font-medium text-gray-700">
            Your Expectations
          </label>
          <textarea
            id="expectations"
            value={formData.expectations}
            onChange={handleChange('expectations')}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="Please share your expectations from the Saarthi IAS Mentorship Program..."
            required
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Summary of Your Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Personal Details:</strong> {formData.name} ({formData.email})</p>
            <p><strong>Location:</strong> {formData.location}</p>
            <p><strong>Education:</strong> {formData.collegeName} - {formData.graduationSubject}</p>
            <p><strong>UPSC Attempts:</strong> Prelims: {formData.preliminaryAttempts}, Mains: {formData.mainExamAttempts}</p>
            <p><strong>Current Affairs Source:</strong> {formData.currentAffairsSource}</p>
            <p><strong>Answer Writing Level:</strong> {formData.answerWritingSkills}</p>
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