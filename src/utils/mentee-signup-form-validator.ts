import { FormData } from '@/types/multistep-form';

export interface FormErrors {
  [key: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

export const validatePersonalInfo = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.length < 3) {
    errors.name = 'Name must be at least 3 characters long';
  }

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid 10-digit phone number';
  }

  if (!formData.gender) {
    errors.gender = 'Please select your gender';
  }

  if (!formData.region) {
    errors.region = 'Please select your region';
  }

  return errors;
};

export const validateEducationBackground = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.reservationCategory) {
    errors.reservationCategory = 'Please select your reservation category';
  }

  if (!formData.optionalSubject) {
    errors.optionalSubject = 'Please select your optional subject';
  }

  return errors;
};

export const validatePreparationJourney = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (formData.preliminaryAttempts < 0 || formData.preliminaryAttempts > 6) {
    errors.preliminaryAttempts = 'Number of preliminary attempts should be between 0 and 6';
  }

  if (formData.mainExamAttempts < 0 || formData.mainExamAttempts > 6) {
    errors.mainExamAttempts = 'Number of mains attempts should be between 0 and 6';
  }

  if (formData.isSaarthiStudent && !formData.vajiramCourse?.trim()) {
    errors.vajiramCourse = 'Please specify the course you were enrolled in';
  }

  if (!formData.answerWritingLevel) {
    errors.answerWritingLevel = 'Please select your answer writing level';
  }

  return errors;
};

export const validateCurrentPreparation = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.menteeUpscExperience) {
    errors.upscExperience = 'Please select your UPSC experience level';
  }

  if (!formData.preferredSlotsOnWeekdays.length) {
    errors.preferredSlotsOnWeekdays = 'Please select at least one preferred time slot';
  }

  if (!formData.weakSubjects.length) {
    errors.weakSubjects = 'Please enter at least one subject you need to improve';
  }

  if (!formData.strongSubjects.length) {
    errors.strongSubjects = 'Please enter at least one subject you are confident in';
  }

  return errors;
};

export const validateExpectations = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.currentAffairsSource) {
    errors.currentAffairsSource = 'Please select your primary source for current affairs';
  }

  return errors;
};

export const validateStep = (step: number, formData: FormData): FormErrors => {
  switch (step) {
    case 1:
      return validatePersonalInfo(formData);
    case 2:
      return validateEducationBackground(formData);
    case 3:
      return validatePreparationJourney(formData);
    case 4:
      return validateCurrentPreparation(formData);
    case 5:
      return validateExpectations(formData);
    default:
      return {};
  }
}; 