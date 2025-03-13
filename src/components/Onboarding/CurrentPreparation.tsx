'use client';

import { FormData } from '@/types/multistep-form';
import { FormErrors } from '@/utils/mentee-signup-form-validator';
import { TimeSlotChooser } from '../ui/TimeSlotChooser';
interface CurrentPreparationProps {
  formData: FormData;
  handleArrayChange: (field: 'weakSubjects' | 'strongSubjects' | 'preferredSlotsOnWeekdays') => (value: string[]) => void;
  errors?: FormErrors;
}

const CurrentPreparation = ({ 
  formData,
  handleArrayChange,
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
        <TimeSlotChooser formData={formData} handleArrayChange={handleArrayChange} />

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