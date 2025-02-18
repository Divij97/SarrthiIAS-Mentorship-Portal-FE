export enum Region {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
  CENTRAL = 'CENTRAL',
  // Add other regions as needed
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum ReservationCategory {
  GENERAL = 'GENERAL',
  OBC = 'OBC',
  SC = 'SC',
  ST = 'ST',
  // Add other categories as needed
}

export enum OptionalSubject {
  ANTHROPOLOGY = 'ANTHROPOLOGY',
  SOCIOLOGY = 'SOCIOLOGY',
  // Add other subjects as needed
}

export enum PreferredSlot {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  // Add other slots as needed
}

export enum AnswerWritingLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Mentee {
  // S1
  name: string;
  email: string;
  phone: string;
  region: Region;
  gender: Gender;

  // S2
  category: ReservationCategory;
  optionalSubject: OptionalSubject;
  isWorkingProfessional: boolean;
  givenInterview: boolean;
  numberOfAttemptsInUpsc: number;
  numberOfMainsAttempts: number;

  // S3
  preferredSlots: PreferredSlot[];
  answerWritingLevel: AnswerWritingLevel;
  weakSubjects: string[];
  strongSubjects: string[];

  // S4
  previouslyEnrolledCourses: string[];
  primarySourceOfCurrentAffairs: string;
  expectationFromMentorshipCourse: string;
}

export interface MenteeResponse {
  exists: boolean;
  mentee: Mentee | null;
} 