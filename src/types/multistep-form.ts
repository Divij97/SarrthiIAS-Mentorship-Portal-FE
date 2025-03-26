import { 
  ReservationCategory, 
  OptionalSubject, 
  Region, 
  Gender, 
  PreferredSlot, 
  AnswerWritingLevel,
  MenteeUpscExperience
} from '@/types/mentee';

export interface FormData {
  // Personal Information
  name: string;
  email: string;
  phoneNumber: string;
  gender: Gender | string;
  region: Region | string;
  
  // Additional Information
  reservationCategory: ReservationCategory | string;
  optionalSubject: OptionalSubject | string;
  isWorkingProfessional: boolean;
  
  // UPSC Preparation Journey
  preliminaryAttempts: number;
  mainExamAttempts: number;
  isSaarthiStudent: boolean;
  menteeUpscExperience: MenteeUpscExperience | string;
  vajiramCourse?: string;
  
  // Current Preparation Details
  preferredSlotsOnWeekdays: PreferredSlot[] | string[];
  answerWritingLevel: AnswerWritingLevel | string;
  weakSubjects: string[];
  strongSubjects: string[];
  
  // Expectations
  previouslyEnrolledCourses: string;
  currentAffairsSource: string;
  expectations: string;
} 