export interface MentorFormData {
  // Step 1: Personal Information
  name: string;
  email: string;
  phone: string;
  region: string;
  gender: string;
  
  // Step 2: Education Background
  optionalSubject: string;
  givenInterview: boolean;
  numberOfAttemptsInUpsc: number;
  numberOfMainsAttempts: number;
  
  // Step 3: Availability
  offDaysOfWeek: string[];
}

export interface FormErrors {
  [key: string]: string;
} 