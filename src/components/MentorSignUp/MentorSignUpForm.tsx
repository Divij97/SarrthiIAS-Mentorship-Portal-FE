'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { DayOfWeek, Mentor, MentorWithAuth } from '@/types/mentor';
import { useLoginStore } from '@/stores/auth/store';
import PersonalInfoStep from './Steps/PersonalInfoStep';
import EducationStep from './Steps/EducationStep';
import AvailabilityStep from './Steps/AvailabilityStep';
import { MentorFormData, FormErrors } from './types';
import { Gender, OptionalSubject, Region } from '@/types/mentee';
import { TempMentorData } from '@/types/auth';
import { signupMentor } from '@/services/mentors';
import { useMentorStore } from '@/stores/mentor/store';
import { SHA256 } from 'crypto-js';

export default function MentorSignUpForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<MentorFormData>({
    // Step 1: Personal Information
    name: '',
    email: '',
    phone: '',
    region: '',
    gender: '',
    
    // Step 2: Education Background
    optionalSubject: '',
    givenInterview: false,
    numberOfAttemptsInUpsc: 0,
    numberOfMainsAttempts: 0,
    
    // Step 3: Availability
    offDaysOfWeek: [],
  });

  

  const router = useRouter();
  const { setAuthHeader } = useLoginStore();
  const { setMentor, mentorResponse } = useMentorStore();


  useEffect(() => {
    if (mentorResponse?.m) {
      const mentor = mentorResponse.m;
      
      // Only set initial values if form fields are empty (to avoid overriding user input)
      if (!formData.name && mentor.name) {
        setFormData(prev => ({
          ...prev,
          name: mentor.name || '',
          email: mentor.email || '',
          phone: mentorResponse.u || '',
        }));
      }
    }
  }, [mentorResponse]);

  // Region options
  const regionOptions = [
    Region.NORTH,
    Region.SOUTH,
    Region.EAST,
    Region.WEST,
    Region.CENTRAL
  ];

  // Day of week options
  const dayOfWeekOptions = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY
  ];

  const nextStep = () => {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setStep(step + 1);
    setErrors({});
  };

  const prevStep = () => {
    setStep(step > 1 ? step - 1 : step);
    setErrors({});
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setFormData({ ...formData, [field]: value });
    
    // Clear error for the field being changed
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleArrayChange = (field: string) => (
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

  const validateStep = (currentStep: number, data: MentorFormData): FormErrors => {
    const errors: FormErrors = {};

    switch (currentStep) {
      case 1: // Personal Information
        if (!data.name.trim()) errors.name = 'Name is required';
        if (!data.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
        if (!data.phone.trim()) errors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(data.phone)) errors.phone = 'Phone number must be 10 digits';
        if (!data.region) errors.region = 'Region is required';
        if (!data.gender) errors.gender = 'Gender is required';
        break;
      
      case 2: // Education Background
        if (!data.optionalSubject) errors.optionalSubject = 'Optional subject is required';
        if (data.numberOfAttemptsInUpsc < 0 || data.numberOfAttemptsInUpsc > 5) {
          errors.numberOfAttemptsInUpsc = 'Number of UPSC attempts must be between 0 and 5';
        }
        if (data.numberOfMainsAttempts < 0 || data.numberOfMainsAttempts > 5) {
          errors.numberOfMainsAttempts = 'Number of Mains attempts must be between 0 and 5';
        }
        break;
      
      case 3: // Availability
        if (data.offDaysOfWeek.length === 0) {
          errors.offDaysOfWeek = 'Please select at least one off day';
        }
        break;
    }

    return errors;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep 
            formData={formData} 
            regionOptions={regionOptions} 
            handleChange={handleChange} 
            errors={errors} 
          />
        );
      case 2:
        return (
          <EducationStep 
            formData={formData} 
            handleChange={handleChange} 
            errors={errors} 
          />
        );
      case 3:
        return (
          <AvailabilityStep 
            formData={formData} 
            dayOfWeekOptions={dayOfWeekOptions}
            handleArrayChange={handleArrayChange} 
            errors={errors} 
          />
        );
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
        const tempMentorDataStr = localStorage.getItem('tempMentorData');
        if (!tempMentorDataStr) {
          setErrors({ submit: 'No temporary data found. Please start from login.' });
          return;
        }
  
        const tempMentorData: TempMentorData = JSON.parse(tempMentorDataStr);
        
        // This is a mentor signup with password update
        const mentorObj: Mentor = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: tempMentorData.phone.trim(),
          region: formData.region as Region,
          gender: formData.gender as Gender,
          optionalSubject: formData.optionalSubject as OptionalSubject,
          givenInterview: formData.givenInterview,
          numberOfAttemptsInUpsc: formData.numberOfAttemptsInUpsc,
          numberOfMainsAttempts: formData.numberOfMainsAttempts,
          offDaysOfWeek: formData.offDaysOfWeek as DayOfWeek[],
        };

        console.log(mentorObj);
        console.log("tempMentorData: ", tempMentorData);
  
        const mentorWithAuth: MentorWithAuth = {
          mentor: mentorObj,
          username: tempMentorData.phone,
          passwordSHA: SHA256(tempMentorData.password).toString(),
          isTempPassword: false,
          updates: {},
          sessionsByDayOfWeek: {}
        };

        console.log("mentorWithAuth: ", mentorWithAuth);
  
        // The response might be { success: true } if no JSON is returned
        const response = await signupMentor(mentorWithAuth);
        
        // After successful signup, create new auth header with the updated password
        const newAuthHeader = `Basic ${btoa(`${tempMentorData.phone}:${tempMentorData.password}`)}`;
        setAuthHeader(newAuthHeader);
        
        // Set the mentor data in the store
        setMentor(mentorObj);
        
        localStorage.removeItem('tempMentorData'); // Clean up
        router.push('/home');
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
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Step {step} of 3
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mentor Registration</h1>
        
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
          {step < 3 ? (
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
}