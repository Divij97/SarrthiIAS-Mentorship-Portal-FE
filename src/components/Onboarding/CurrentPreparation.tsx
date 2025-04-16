'use client';

import { FormData } from '@/types/multistep-form';
import { FormErrors } from '@/utils/mentee-signup-form-validator';
import { MenteeUpscExperience } from '@/types/mentee';

interface CurrentPreparationProps {
  formData: FormData;
  handleArrayChange: (field: 'weakSubjects' | 'strongSubjects' | 'preferredSlotsOnWeekdays') => (value: string[]) => void;
  handleChange: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors?: FormErrors;
}

// Map UPSC experience options to more user-friendly labels
const upscExperienceOptions = [
  { value: MenteeUpscExperience.JUST_STARTED_PREPARATION, label: 'Just started preparation' },
  { value: MenteeUpscExperience.FINISHED_FOUNDATION_COACHING_GIVEN_1_ATTEMPT, label: 'Finished foundation coaching, given 1 attempt' },
  { value: MenteeUpscExperience.GIVEN_MULTIPLE_PRELIMS_ATTEMPTS, label: 'Given multiple prelims attempts' },
  { value: MenteeUpscExperience.GIVEN_1_OR_MORE_MAINS, label: 'Given 1 or more mains' },
  { value: MenteeUpscExperience.INTERVIEW_GIVEN, label: 'Interview given' }
];

const CurrentPreparation = ({ 
  formData,
  handleArrayChange,
  handleChange,
  errors
}: CurrentPreparationProps) => {
  
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
      <p className="text-sm font-medium text-red-600">* All fields are required</p>

      <div className="space-y-4">
        <div className="mb-4">
          <label htmlFor="upscExperience" className="block text-sm font-medium text-gray-700">
            UPSC Experience Level
          </label>
          <select
            id="upscExperience"
            name="upscExperience"
            value={formData.menteeUpscExperience}
            onChange={handleChange('menteeUpscExperience')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            {upscExperienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors?.upscExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.upscExperience}</p>
          )}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., Polity, Geography, Ethics"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentPreparation; 