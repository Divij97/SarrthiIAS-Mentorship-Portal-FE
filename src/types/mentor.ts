import { Region, Gender, OptionalSubject, UnscheduledMenteeDetails, StrippedDownMentee } from './mentee';
import { GroupMentorshipSession, MentorshipSession, SessionUpdate } from './session';

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
  m: Mentor | null;
  u: string | null;
  it: boolean;
  o: string | null;
  sw: { [key in DayOfWeek]?: MentorshipSession[] };
  sd: { [date: string]: MentorshipSession[] };
  g: string[];
  um: UnscheduledMenteeDetails;
  am: StrippedDownMentee[];
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
  groupSessions: GroupMentorshipSession[];
}