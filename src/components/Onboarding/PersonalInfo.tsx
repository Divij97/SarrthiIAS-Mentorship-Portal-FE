'use client';

import { FormData } from '@/types/multistep-form';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { useMenteeStore } from '@/stores/mentee/store';
import { Gender, Region, MenteeMode } from '@/types/mentee';

interface PersonalInfoProps {
  formData: FormData;
  handleChange: (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  region: Region[];
  errors?: Record<string, string>;
}

// Map gender options to enum values
const genderOptions = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' },
  { value: Gender.OTHER, label: 'Other' }
];

const modeOptions = [
  { value: MenteeMode.ONLINE, label: 'Online' },
  { value: MenteeMode.OFFLINE, label: 'Offline' }
];

const PersonalInfo = ({ formData, handleChange, region, errors }: PersonalInfoProps) => {
  const { menteeResponse } = useMenteeStore();

  // Custom handler for gender to ensure enum values are used
  const handleGenderChange = (value: string) => {
    // Find matching enum value
    const enumValue = Object.values(Gender).find(
      gender => gender === value
    );
    
    // Create a custom event with the enum value
    handleChange('gender')({ target: { value: enumValue || value } } as any);
  };

  // Custom handler for region to ensure enum values are used
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectValue = e.target.value;
    
    // Find matching enum value
    const enumValue = Object.values(Region).find(
      regionVal => regionVal === selectValue
    );
    
    // Create a custom event with the enum value
    if (enumValue) {
      const customEvent = {
        ...e,
        target: {
          ...e.target,
          value: enumValue
        }
      };
      handleChange('region')(customEvent);
    } else {
      // Pass the original event if no matching enum value
      handleChange('region')(e);
    }
  };

  // Custom handler for mode to ensure enum values are used
  const handleModeChange = (value: string) => {
    // Find matching enum value
    const enumValue = Object.values(MenteeMode).find(
      mode => mode === value
    );
    
    // Create a custom event with the enum value
    handleChange('mode')({ target: { value: enumValue || value } } as any);
  };

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
            value={formData.name}
            onChange={handleChange('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-gray-100"
            required
            disabled
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-gray-100"
            required
            disabled
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber || menteeResponse?.username || ''}
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
            onChange={handleGenderChange}
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
            onChange={handleRegionChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
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
        {/*TODO: remove */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mode of Mentorship</label>
          <RadioGroup
            value={formData.mode || MenteeMode.ONLINE}
            onChange={handleModeChange}
            options={modeOptions}
            name="mode"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo; 