import { Region, Gender, OptionalSubject } from './mentee';
import { MentorshipSession, SessionUpdate } from './session';

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

export interface GroupMentorshipSession {
  sessionId: string;
  groupFriendlyName: string;
  dateOfSession: number; // Day of month (1-31)
  startTime: string; // 24-hour format HH:mm
  endTime: string; // 24-hour format HH:mm
  mentorUserName: string;
  mentorName: string;
  zoomLink: string;
}

export interface MentorResponse {
  mentor: Mentor | null;
  username: string | null;
  isTempPassword: boolean;
  otp: string | null;
  sessionsByDayOfWeek: { [key in DayOfWeek]?: MentorshipSession[] };
  sessionsByDate: { [date: string]: MentorshipSession[] };
  groupMentorshipSessions: GroupMentorshipSession[];
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