'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '@/types/form';
import PersonalInfo from '@/components/Onboarding/PersonalInfo';
import EducationBackground from '@/components/Onboarding/EducationBackground';
import PreparationJourney from '@/components/Onboarding/PreparationJourney';
import CurrentPreparation from '@/components/Onboarding/CurrentPreparation';
import Expectations from '@/components/Onboarding/Expectations';
import { Button } from '@/components/ui/Button';
import { Mentor } from '@/types/mentor';
import { Region, Gender, OptionalSubject } from '@/types/mentee';
import { signupMentor } from '@/services/mentors';
import { validateStep, FormErrors } from '@/utils/MultiStepFormValidator';

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

  const router = useRouter();

  // Update region options to use enum values
  const regionOptions = [
    Region.NORTH,
    Region.SOUTH,
    Region.EAST,
    Region.WEST,
    Region.CENTRAL
  ];

  const nextStep = () => {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length === 0) {
      setStep(step + 1);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const prevStep = () => {
    setStep(step > 1 ? step - 1 : step);
    setErrors({});
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    // Clear error for the field being changed
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleArrayChange = (field: 'weakSubjects' | 'strongSubjects' | 'preferredSlotsOnWeekdays') => (
    value: string[]
  ) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for the field being changed
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo formData={formData} region={regionOptions} handleChange={handleChange} errors={errors} />;
      case 2:
        return <EducationBackground formData={formData} handleChange={handleChange} errors={errors} />;
      case 3:
        return <PreparationJourney formData={formData} handleChange={handleChange} errors={errors} />;
      case 4:
        return (
          <CurrentPreparation
            formData={formData}
            handleArrayChange={handleArrayChange}
            errors={errors}
          />
        );
      case 5:
        return <Expectations formData={formData} handleChange={handleChange} errors={errors} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const finalStepErrors = validateStep(step, formData);
    if (Object.keys(finalStepErrors).length > 0) {
      setErrors(finalStepErrors);
      return;
    }

    try {
      const tempPassword = localStorage.getItem('tempMentorPassword');
      if (tempPassword) {
        // This is a mentor signup with password update
        const mentorData: Mentor = {
          name: formData.name,
          email: formData.email,
          phone: formData.phoneNumber,
          region: formData.region as Region,
          gender: formData.gender as Gender,
          optionalSubject: formData.optionalSubject as OptionalSubject,
          givenInterview: formData.preliminaryAttempts > 0,
          numberOfAttemptsInUpsc: formData.preliminaryAttempts,
          numberOfMainsAttempts: formData.mainExamAttempts,
          offDaysOfWeek: [], // This can be updated later
        };

        await signupMentor(mentorData, tempPassword);
        localStorage.removeItem('tempMentorPassword'); // Clean up
        router.push('/home');
      } else {
        // Regular form submission
        console.log('Form submitted:', formData);
        // Implement regular form submission here
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Step {step} of 5
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderStep()}
        
        {errors.submit && (
          <div className="mt-4 text-red-600 text-sm">{errors.submit}</div>
        )}
        
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              Back
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={nextStep} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm; 