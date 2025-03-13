'use client';

import { FormData } from '@/types/multistep-form';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { useMenteeStore } from '@/stores/mentee/store';

interface PersonalInfoProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  region: string[];
  errors?: Record<string, string>;
}

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

const PersonalInfo = ({ formData, handleChange, region, errors }: PersonalInfoProps) => {
  const { menteeResponse } = useMenteeStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
      <p className="text-gray-600">Please provide your basic details</p>
      <p className="text-sm font-medium text-red-600">* All fields are required</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={menteeResponse?.mentee?.name || formData.name}
            onChange={handleChange('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={menteeResponse?.username || formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-gray-100"
            required
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <RadioGroup
            value={formData.gender}
            onChange={(value) => handleChange('gender')({ target: { value } } as any)}
            options={genderOptions}
            name="gender"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange('region')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Select a region</option>
            {region.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors?.region && (
            <p className="mt-1 text-sm text-gray-700">{errors.region}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo; 