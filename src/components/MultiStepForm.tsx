'use client';

import { useState } from 'react';
import PersonalInfo from '@/components/Onboarding/PersonalInfo';
import EducationBackground from '@/components/Onboarding/EducationBackground';
import PreparationJourney from '@/components/Onboarding/PreparationJourney';
import CurrentPreparation from '@/components/Onboarding/CurrentPreparation';
import Expectations from '@/components/Onboarding/Expectations';

interface FormErrors {
  [key: string]: string;
}

// Add the Region type
export type Region = 'North' | 'South' | 'East' | 'West';

export interface FormData {
  // Personal Information
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  region: Region | '';
  
  // Additional Information
  reservationCategory: string;
  optionalSubject: string;
  isWorkingProfessional: boolean;
  
  // UPSC Preparation Journey
  preliminaryAttempts: number;
  mainExamAttempts: number;
  isSaarthiStudent: boolean;
  vajiramCourse?: string;
  
  // Current Preparation Details
  preferredSlotsOnWeekdays: string[];
  answerWritingLevel: string;
  weakSubjects: string[];
  strongSubjects: string[];
  
  // Expectations
  previouslyEnrolledCourses: string;
  currentAffairsSource: string;
  expectations: string;
}

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    region: '',
    reservationCategory: '',
    optionalSubject: '',
    isWorkingProfessional: false,
    preliminaryAttempts: 0,
    mainExamAttempts: 0,
    isSaarthiStudent: false,
    preferredSlotsOnWeekdays: [],
    answerWritingLevel: '',
    weakSubjects: [],
    strongSubjects: [],
    previouslyEnrolledCourses: '',
    currentAffairsSource: '',
    expectations: ''
  });

  // Update region options to be of type Region[]
  const regionOptions: Region[] = ['North', 'South', 'East', 'West'];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step > 1 ? step - 1 : step);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (field: 'weakSubjects' | 'strongSubjects' | 'preferredSlotsOnWeekdays') => (
    value: string[]
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo formData={formData} region={regionOptions} handleChange={handleChange} />;
      case 2:
        return <EducationBackground formData={formData} handleChange={handleChange} />;
      case 3:
        return <PreparationJourney formData={formData} handleChange={handleChange} />;
      case 4:
        return (
          <CurrentPreparation
            formData={formData}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
          />
        );
      case 5:
        return <Expectations formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      // Will implement API call here
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 1:
        // ... existing validations ...
        if (!formData.region) newErrors.region = 'Please select a region';
        break;
      // ... rest of the validation cases ...
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Step {step} of 5
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderStep()}
        
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm; 