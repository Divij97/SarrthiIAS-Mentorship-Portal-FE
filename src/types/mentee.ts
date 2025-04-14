import { Course } from "./course";
import { DayOfWeek, StrippedDownMentor } from "./mentor";
import { SessionType, SuggestedInterval } from "./session";

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
  SC_ST = 'SC/ST',
  // Add other categories as needed
}

export enum OptionalSubject {
  NOT_DECIDED = 'NOT_DECIDED',
  AGRICULTURE = 'AGRICULTURE',
  ANIMAL_HUSBANDRY_AND_VETERINARY_SCIENCE = 'ANIMAL_HUSBANDRY_AND_VETERINARY_SCIENCE',
  ANTHROPOLOGY = 'ANTHROPOLOGY',
  BOTANY = 'BOTANY',
  CHEMISTRY = 'CHEMISTRY',
  CIVIL_ENGINEERING = 'CIVIL_ENGINEERING',
  ELECTRICAL_ENGINEERING = 'ELECTRICAL_ENGINEERING',
  MECHANICAL_ENGINEERING = 'MECHANICAL_ENGINEERING',
  MEDICAL_SCIENCE = 'MEDICAL_SCIENCE',
  PHYSICS = 'PHYSICS',
  ZOOLOGY = 'ZOOLOGY',
  COMMERCE_AND_ACCOUNTANCY = 'COMMERCE_AND_ACCOUNTANCY',
  MANAGEMENT = 'MANAGEMENT',
  MATHEMATICS = 'MATHEMATICS',
  STATISTICS = 'STATISTICS',
  ECONOMICS = 'ECONOMICS',
  GEOGRAPHY = 'GEOGRAPHY',
  GEOLOGY = 'GEOLOGY',
  HISTORY = 'HISTORY',
  LAW = 'LAW',
  PHILOSOPHY = 'PHILOSOPHY',
  POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS = 'POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS',
  PSYCHOLOGY = 'PSYCHOLOGY',
  PUBLIC_ADMINISTRATION = 'PUBLIC_ADMINISTRATION',
  SOCIOLOGY = 'SOCIOLOGY',
  ASSAMESE = 'ASSAMESE',
  BENGALI = 'BENGALI',
  BODO = 'BODO',
  DOGRI = 'DOGRI',
  GUJARATI = 'GUJARATI',
  HINDI = 'HINDI',
  KANNADA = 'KANNADA',
  KASHMIRI = 'KASHMIRI',
  KONKANI = 'KONKANI',
  MAITHILI = 'MAITHILI',
  MALAYALAM = 'MALAYALAM',
  MANIPURI = 'MANIPURI',
  MARATHI = 'MARATHI',
  NEPALI = 'NEPALI',
  ORIYA = 'ORIYA',
  PUNJABI = 'PUNJABI',
  SANSKRIT = 'SANSKRIT',
  SANTHALI = 'SANTHALI',
  SINDHI = 'SINDHI',
  TAMIL = 'TAMIL',
  TELUGU = 'TELUGU',
  URDU = 'URDU',
  ENGLISH = 'ENGLISH'
}

export const OptionalSubjectLabels: Record<OptionalSubject, string> = {
  [OptionalSubject.NOT_DECIDED]: 'Not Decided yet',
  [OptionalSubject.AGRICULTURE]: 'Agriculture',
  [OptionalSubject.ANIMAL_HUSBANDRY_AND_VETERINARY_SCIENCE]: 'Animal Husbandry and Veterinary Science',
  [OptionalSubject.ANTHROPOLOGY]: 'Anthropology',
  [OptionalSubject.BOTANY]: 'Botany',
  [OptionalSubject.CHEMISTRY]: 'Chemistry',
  [OptionalSubject.CIVIL_ENGINEERING]: 'Civil Engineering',
  [OptionalSubject.ELECTRICAL_ENGINEERING]: 'Electrical Engineering',
  [OptionalSubject.MECHANICAL_ENGINEERING]: 'Mechanical Engineering',
  [OptionalSubject.MEDICAL_SCIENCE]: 'Medical Science',
  [OptionalSubject.PHYSICS]: 'Physics',
  [OptionalSubject.ZOOLOGY]: 'Zoology',
  [OptionalSubject.COMMERCE_AND_ACCOUNTANCY]: 'Commerce and Accountancy',
  [OptionalSubject.MANAGEMENT]: 'Management',
  [OptionalSubject.MATHEMATICS]: 'Mathematics',
  [OptionalSubject.STATISTICS]: 'Statistics',
  [OptionalSubject.ECONOMICS]: 'Economics',
  [OptionalSubject.GEOGRAPHY]: 'Geography',
  [OptionalSubject.GEOLOGY]: 'Geology',
  [OptionalSubject.HISTORY]: 'History',
  [OptionalSubject.LAW]: 'Law',
  [OptionalSubject.PHILOSOPHY]: 'Philosophy',
  [OptionalSubject.POLITICAL_SCIENCE_AND_INTERNATIONAL_RELATIONS]: 'Political Science and International Relations',
  [OptionalSubject.PSYCHOLOGY]: 'Psychology',
  [OptionalSubject.PUBLIC_ADMINISTRATION]: 'Public Administration',
  [OptionalSubject.SOCIOLOGY]: 'Sociology',
  [OptionalSubject.ASSAMESE]: 'Assamese',
  [OptionalSubject.BENGALI]: 'Bengali',
  [OptionalSubject.BODO]: 'Bodo',
  [OptionalSubject.DOGRI]: 'Dogri',
  [OptionalSubject.GUJARATI]: 'Gujarati',
  [OptionalSubject.HINDI]: 'Hindi',
  [OptionalSubject.KANNADA]: 'Kannada',
  [OptionalSubject.KASHMIRI]: 'Kashmiri',
  [OptionalSubject.KONKANI]: 'Konkani',
  [OptionalSubject.MAITHILI]: 'Maithili',
  [OptionalSubject.MALAYALAM]: 'Malayalam',
  [OptionalSubject.MANIPURI]: 'Manipuri',
  [OptionalSubject.MARATHI]: 'Marathi',
  [OptionalSubject.NEPALI]: 'Nepali',
  [OptionalSubject.ORIYA]: 'Oriya',
  [OptionalSubject.PUNJABI]: 'Punjabi',
  [OptionalSubject.SANSKRIT]: 'Sanskrit',
  [OptionalSubject.SANTHALI]: 'Santhali',
  [OptionalSubject.SINDHI]: 'Sindhi',
  [OptionalSubject.TAMIL]: 'Tamil',
  [OptionalSubject.TELUGU]: 'Telugu',
  [OptionalSubject.URDU]: 'Urdu',
  [OptionalSubject.ENGLISH]: 'English'
};

export enum PreferredSlot {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  ALL = 'ALL'
}

export enum AnswerWritingLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum MenteeUpscExperience {
  JUST_STARTED_PREPARATION = "JUST_STARTED_PREPARATION",
  FINISHED_FOUNDATION_COACHING_GIVEN_1_ATTEMPT = "FINISHED_FOUNDATION_COACHING_GIVEN_1_ATTEMPT",
  GIVEN_MULTIPLE_PRELIMS_ATTEMPTS = "GIVEN_MULTIPLE_PRELIMS_ATTEMPTS",
  GIVEN_1_OR_MORE_MAINS = "GIVEN_1_OR_MORE_MAINS",
  INTERVIEW_GIVEN = "INTERVIEW_GIVEN"
}

export interface Mentee {
  // S1
  n: string;
  e: string;
  p: string;
  region: Region;
  gender: Gender;
  mode?: MenteeMode;

  // S2
  category: ReservationCategory;
  optionalSubject: OptionalSubject;
  isWorkingProfessional: boolean;
  givenInterview: boolean;
  numberOfAttemptsInUpsc: number;
  numberOfMainsAttempts: number;
  menteeUpscExperience?: MenteeUpscExperience;

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
  enrolledCourses: CourseGroupInfo[];
  assignedMentorUsername: string | null;
  assignedMentor: StrippedDownMentor | null;
  mentorshipSessions?: {[date: string]: MenteeSession[]};
}

export interface MenteeWithAuth {
  mentee: Mentee;
  username: string;
  passwordSHA: string;
  isTempPassword: boolean;
  enrolledCourses: CourseGroupInfo[];
}

export interface CourseGroupInfo {
  course: Course;
  assignedGroup: string;
}

export interface UnscheduledMenteeDetails {
  strippedDownMentees: StrippedDownMentee[];
  suggestedIntervalByDayOfWeek: { [key in DayOfWeek]?: SuggestedInterval[] };
}

export interface StrippedDownMentee {
  n: string;
  p: string;
  e: string;
  preferredSlot?: PreferredSlot;
  mode?: MenteeMode;
}

export interface MenteesForCsvExport {
  name: string;
  phone: string;
  email: string;
  attemptCount: number;
  assignedGroupName: string;
  givenInterview: boolean;
  givenMains: boolean;
  menteeUpscExperience: MenteeUpscExperience;
  assignedMentor?: StrippedDownMentor;
}


export interface MenteeSession {
  id: string;
  startTime: string;
  endTime: string;
  menteeFullName: string;
  menteeUserName: string;
  zoomLink: string;
  sessionType: SessionType;
}

export enum MenteeMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}