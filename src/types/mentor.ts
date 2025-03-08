import { Region, Gender, OptionalSubject } from './mentee';

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
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
}