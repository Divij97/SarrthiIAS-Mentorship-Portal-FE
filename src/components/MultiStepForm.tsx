'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '@/types/multistep-form';
import PersonalInfo from '@/components/Onboarding/PersonalInfo';
import EducationBackground from '@/components/Onboarding/EducationBackground';
import PreparationJourney from '@/components/Onboarding/PreparationJourney';
import CurrentPreparation from '@/components/Onboarding/CurrentPreparation';
import Expectations from '@/components/Onboarding/Expectations';
import { Button } from '@/components/ui/Button';
import { Region, Gender, OptionalSubject, Mentee, MenteeWithAuth, ReservationCategory, PreferredSlot, AnswerWritingLevel, MenteeUpscExperience, MenteeResponse, MenteeMode } from '@/types/mentee';
import { signupMentee, getMenteeByPhone } from '@/services/mentee';
import { validateStep, FormErrors } from '@/utils/mentee-signup-form-validator';
import { useMenteeStore } from '@/stores/mentee/store';
import { useLoginStore } from '@/stores/auth/store';
import { TempMenteeData } from '@/types/auth';
import { SHA256 } from 'crypto-js';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isOptionalSubjectValid, setIsOptionalSubjectValid] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    gender: Gender.MALE,
    region: Region.NORTH,
    mode: MenteeMode.ONLINE,
    reservationCategory: ReservationCategory.GENERAL,
    optionalSubject: OptionalSubject.NOT_DECIDED,
    isWorkingProfessional: false,
    preliminaryAttempts: 0,
    mainExamAttempts: 0,
    isSaarthiStudent: false,
    menteeUpscExperience: MenteeUpscExperience.JUST_STARTED_PREPARATION,
    answerWritingLevel: AnswerWritingLevel.BEGINNER,
    weakSubjects: [],
    strongSubjects: [],
    previouslyEnrolledCourses: '',
    currentAffairsSource: 'Newspaper',
    expectations: ''
  });

  const router = useRouter();
  const { setAuthHeader } = useLoginStore();
  const { menteeResponse, setMenteeResponse } = useMenteeStore();

  // Initialize form data with mentee data if available
  useEffect(() => {
    if (menteeResponse?.mentee) {
      const mentee = menteeResponse.mentee;
      
      // Only set values that are empty or undefined
      setFormData(prev => ({
        ...prev,
        name: prev.name || mentee.n || '',
        email: prev.email || mentee.e || '',
        phoneNumber: prev.phoneNumber || menteeResponse.username || '',
        gender: prev.gender || mentee.gender || Gender.MALE,
        region: prev.region || mentee.region || Region.NORTH,
        reservationCategory: prev.reservationCategory || mentee.category || ReservationCategory.GENERAL,
        optionalSubject: prev.optionalSubject || mentee.optionalSubject,
        isWorkingProfessional: prev.isWorkingProfessional || mentee.isWorkingProfessional || false,
        preliminaryAttempts: prev.preliminaryAttempts || mentee.numberOfAttemptsInUpsc || 0,
        mainExamAttempts: prev.mainExamAttempts || mentee.numberOfMainsAttempts || 0,
        menteeUpscExperience: prev.menteeUpscExperience || mentee.menteeUpscExperience || MenteeUpscExperience.JUST_STARTED_PREPARATION,
        answerWritingLevel: prev.answerWritingLevel || mentee.answerWritingLevel || AnswerWritingLevel.BEGINNER,
        weakSubjects: prev.weakSubjects || mentee.weakSubjects || [],
        strongSubjects: prev.strongSubjects || mentee.strongSubjects || [],
        previouslyEnrolledCourses: prev.previouslyEnrolledCourses || mentee.previouslyEnrolledCourses?.[0] || '',
        currentAffairsSource: prev.currentAffairsSource || mentee.primarySourceOfCurrentAffairs || '',
        expectations: prev.expectations || mentee.expectationFromMentorshipCourse || ''
      }));
    }
  }, [menteeResponse]);

  // Update region options to use enum values
  const regionOptions = [
    Region.NORTH,
    Region.SOUTH,
    Region.EAST,
    Region.WEST,
    Region.CENTRAL
  ];

  const nextStep = () => {
    if (step === 2 && !isOptionalSubjectValid) {
      return;
    }
    setStep(step + 1);
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
        return <EducationBackground formData={formData} handleChange={handleChange} errors={errors} setErrors={setErrors} onValidationChange={setIsOptionalSubjectValid} />;
      case 3:
        return <PreparationJourney formData={formData} handleChange={handleChange} errors={errors} />;
      case 4:
        return (
          <CurrentPreparation
            formData={formData}
            handleArrayChange={handleArrayChange}
            handleChange={handleChange}
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
      const tempMenteeDataStr = localStorage.getItem('tempMenteeData');
      if (!tempMenteeDataStr) {
        setErrors({ submit: 'No temporary data found. Please start from login.' });
        return;
      }

      const tempMenteeData: TempMenteeData = JSON.parse(tempMenteeDataStr);
      
      // This is a mentee signup with password update
      const menteeObj: Mentee = {
        n: formData.name,
        e: formData.email,
        p: tempMenteeData.phone,
        region: formData.region as Region,
        gender: formData.gender as Gender,
        category: formData.reservationCategory as ReservationCategory,
        optionalSubject: formData.optionalSubject as OptionalSubject,
        isWorkingProfessional: formData.isWorkingProfessional,
        givenInterview: formData.preliminaryAttempts > 0,
        numberOfAttemptsInUpsc: formData.preliminaryAttempts,
        numberOfMainsAttempts: formData.mainExamAttempts,
        menteeUpscExperience: formData.menteeUpscExperience as MenteeUpscExperience,
        preferredSlots: [PreferredSlot.ALL],
        answerWritingLevel: formData.answerWritingLevel as AnswerWritingLevel,
        weakSubjects: formData.weakSubjects,
        strongSubjects: formData.strongSubjects,
        previouslyEnrolledCourses: formData.previouslyEnrolledCourses ? [formData.previouslyEnrolledCourses] : [],
        primarySourceOfCurrentAffairs: formData.currentAffairsSource,
        expectationFromMentorshipCourse: formData.expectations || '',
        mode: formData.mode as MenteeMode,
      };

      const menteeWithAuth: MenteeWithAuth = {
        mentee: menteeObj,
        username: tempMenteeData.phone,
        passwordSHA: SHA256(tempMenteeData.password).toString(),
        isTempPassword: false,
        enrolledCourses: menteeResponse.enrolledCourses
      };


      const assignMentor =  tempMenteeData.hasOneOnOneMentorship;
      await signupMentee(menteeWithAuth, assignMentor);
      
      // After successful signup, create new auth header with the updated password
      const newAuthHeader = `Basic ${btoa(`${tempMenteeData.phone}:${tempMenteeData.password}`)}`;
      
      // Update the auth store with auth header
      setAuthHeader(newAuthHeader);
      const newMenteeResponse: MenteeResponse = {
        isTempPassword: false,
        mentee: menteeObj,
        otp: null,
        username: tempMenteeData.phone,
        enrolledCourses: menteeWithAuth.enrolledCourses,
        assignedMentorUsername: menteeResponse.assignedMentorUsername,
        assignedMentor: menteeResponse.assignedMentor,
        mentorshipSessions: menteeResponse.mentorshipSessions
      };
      
      
      setMenteeResponse(newMenteeResponse);
      
      localStorage.removeItem('tempMenteeData'); // Clean up
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
            <Button 
              onClick={nextStep} 
              className="ml-auto"
            >
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