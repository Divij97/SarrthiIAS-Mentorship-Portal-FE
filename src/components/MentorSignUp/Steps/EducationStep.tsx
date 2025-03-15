'use client';

import { FormErrors, MentorFormData } from '@/components/MentorSignUp/types';

interface EducationStepProps {
  formData: MentorFormData;
  handleChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: FormErrors;
}

export default function EducationStep({ formData, handleChange, errors }: EducationStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Education Background</h2>
      
      <div>
        <label htmlFor="optionalSubject" className="block text-sm font-medium text-gray-700">
          Optional Subject
        </label>
        <select
          id="optionalSubject"
          value={formData.optionalSubject}
          onChange={handleChange('optionalSubject')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
            errors.optionalSubject ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select Optional Subject</option>
          <option value="AGRICULTURE">Agriculture</option>
          <option value="ANIMAL_HUSBANDRY_AND_VETERINARY_SCIENCE">Animal Husbandry and Veterinary Science</option>
          <option value="ANTHROPOLOGY">Anthropology</option>
          <option value="BOTANY">Botany</option>
          <option value="CHEMISTRY">Chemistry</option>
          <option value="CIVIL_ENGINEERING">Civil Engineering</option>
          <option value="COMMERCE_AND_ACCOUNTANCY">Commerce and Accountancy</option>
          <option value="ECONOMICS">Economics</option>
          <option value="ELECTRICAL_ENGINEERING">Electrical Engineering</option>
          <option value="GEOGRAPHY">Geography</option>
          <option value="GEOLOGY">Geology</option>
          <option value="HISTORY">History</option>
          <option value="LAW">Law</option>
          <option value="MANAGEMENT">Management</option>
          <option value="MATHEMATICS">Mathematics</option>
          <option value="MECHANICAL_ENGINEERING">Mechanical Engineering</option>
          <option value="MEDICAL_SCIENCE">Medical Science</option>
          <option value="PHILOSOPHY">Philosophy</option>
          <option value="PHYSICS">Physics</option>
          <option value="POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS">Political Science and International Relations</option>
          <option value="PSYCHOLOGY">Psychology</option>
          <option value="PUBLIC_ADMINISTRATION">Public Administration</option>
          <option value="SOCIOLOGY">Sociology</option>
          <option value="STATISTICS">Statistics</option>
          <option value="ZOOLOGY">Zoology</option>
          <option value="LITERATURE">Literature</option>
        </select>
        {errors.optionalSubject && <p className="mt-1 text-sm text-red-600">{errors.optionalSubject}</p>}
      </div>

      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="givenInterview"
            checked={formData.givenInterview}
            onChange={handleChange('givenInterview')}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="givenInterview" className="ml-2 block text-sm text-gray-700">
            Have you given the UPSC interview?
          </label>
        </div>
        {errors.givenInterview && <p className="mt-1 text-sm text-red-600">{errors.givenInterview}</p>}
      </div>

      <div>
        <label htmlFor="numberOfAttemptsInUpsc" className="block text-sm font-medium text-gray-700">
          Number of UPSC Attempts
        </label>
        <input
          type="number"
          id="numberOfAttemptsInUpsc"
          min="0"
          max="5"
          value={formData.numberOfAttemptsInUpsc}
          onChange={handleChange('numberOfAttemptsInUpsc')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
            errors.numberOfAttemptsInUpsc ? 'border-red-300' : ''
          }`}
        />
        {errors.numberOfAttemptsInUpsc && <p className="mt-1 text-sm text-red-600">{errors.numberOfAttemptsInUpsc}</p>}
      </div>

      <div>
        <label htmlFor="numberOfMainsAttempts" className="block text-sm font-medium text-gray-700">
          Number of Mains Attempts
        </label>
        <input
          type="number"
          id="numberOfMainsAttempts"
          min="0"
          max="5"
          value={formData.numberOfMainsAttempts}
          onChange={handleChange('numberOfMainsAttempts')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
            errors.numberOfMainsAttempts ? 'border-red-300' : ''
          }`}
        />
        {errors.numberOfMainsAttempts && <p className="mt-1 text-sm text-red-600">{errors.numberOfMainsAttempts}</p>}
      </div>
    </div>
  );
} 