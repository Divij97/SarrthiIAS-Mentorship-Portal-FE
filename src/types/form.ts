export interface FormData {
  // Personal Information
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  region: string;
  
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