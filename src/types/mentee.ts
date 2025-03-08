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
  // Science and Engineering
  AGRICULTURE = 'Agriculture',
  ANIMAL_HUSBANDRY_AND_VETERINARY_SCIENCE = 'Animal Husbandry and Veterinary Science',
  ANTHROPOLOGY = 'Anthropology',
  BOTANY = 'Botany',
  CHEMISTRY = 'Chemistry',
  CIVIL_ENGINEERING = 'Civil Engineering',
  ELECTRICAL_ENGINEERING = 'Electrical Engineering',
  MECHANICAL_ENGINEERING = 'Mechanical Engineering',
  MEDICAL_SCIENCE = 'Medical Science',
  PHYSICS = 'Physics',
  ZOOLOGY = 'Zoology',
  
  // Commerce and Management
  COMMERCE_AND_ACCOUNTANCY = 'Commerce and Accountancy',
  MANAGEMENT = 'Management',
  
  // Mathematics and Statistics
  MATHEMATICS = 'Mathematics',
  STATISTICS = 'Statistics',
  
  // Social Sciences
  ECONOMICS = 'Economics',
  GEOGRAPHY = 'Geography',
  GEOLOGY = 'Geology',
  HISTORY = 'History',
  LAW = 'Law',
  PHILOSOPHY = 'Philosophy',
  POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS = 'Political Science and International Relations',
  PSYCHOLOGY = 'Psychology',
  PUBLIC_ADMINISTRATION = 'Public Administration',
  SOCIOLOGY = 'Sociology',
  
  // Languages
  ASSAMESE = 'Assamese',
  BENGALI = 'Bengali',
  BODO = 'Bodo',
  DOGRI = 'Dogri',
  GUJARATI = 'Gujarati',
  HINDI = 'Hindi',
  KANNADA = 'Kannada',
  KASHMIRI = 'Kashmiri',
  KONKANI = 'Konkani',
  MAITHILI = 'Maithili',
  MALAYALAM = 'Malayalam',
  MANIPURI = 'Manipuri',
  MARATHI = 'Marathi',
  NEPALI = 'Nepali',
  ORIYA = 'Oriya',
  PUNJABI = 'Punjabi',
  SANSKRIT = 'Sanskrit',
  SANTHALI = 'Santhali',
  SINDHI = 'Sindhi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  URDU = 'Urdu',
  ENGLISH = 'English'
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
  isTempPassword: boolean;
  mentee: Mentee | null;
  otp: string | null;
  username: string | null;
} 