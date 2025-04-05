import { Region, Gender, OptionalSubject, UnscheduledMenteeDetails, StrippedDownMentee } from './mentee';
import { MentorshipGroup, MentorshipSession, SessionUpdate } from './session';

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export interface MenteeIdentifier {
  name: string;
  phone: string;
}

export interface Mentor {
  name: string;
  email: string;
  phone: string;
  region: Region;
  gender: Gender;
  optionalSubject: OptionalSubject;
  givenInterview: boolean;
  numberOfAttemptsInUpsc: number;
  numberOfMainsAttempts: number;
  offDaysOfWeek: DayOfWeek[];
}

export interface MentorResponse {
  mentor: Mentor | null;
  username: string | null;
  isTempPassword: boolean;
  otp: string | null;
  sessionsByDayOfWeek: { [key in DayOfWeek]?: MentorshipSession[] };
  sessionsByDate: { [date: string]: MentorshipSession[] };
  groups: string[];
  unscheduledMenteeDetails: UnscheduledMenteeDetails;
  assignedMentees: StrippedDownMentee[];
}

export interface MentorWithAuth {
  mentor: Mentor;
  username: string;
  passwordSHA: string;
  isTempPassword: boolean;
  courses?: Set<string>;
  updates: { [sessionId: string]: SessionUpdate };
  sessionsByDayOfWeek?: { [key in DayOfWeek]?: MentorshipSession[] };
}

export interface StrippedDownMentor {
  name: string;
  email: string;
  phone: string;
}

export interface MentorGroupsBulkResponse {
  groupSessions: MentorshipGroup[];
}