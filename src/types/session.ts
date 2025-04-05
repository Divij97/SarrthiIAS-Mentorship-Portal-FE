import { Course } from "./course";
import { ZoomMeetingInfo } from "./meeting";
import { StrippedDownMentee } from "./mentee";
import { DayOfWeek } from "./mentor";

export interface MentorshipSession {
  id: string;
  menteeFullName: string;
  menteeUsername: string;
  // Can be derived from zoomLink !== null
  isZoomLinkGenerated?: boolean;
  zoomLink: string | null;
  startTime: string;
  endTime: string;
  mentorUsername: string;
  mentorName: string;
  recurrence?: Recurrence;
  sessionType: SessionType;
}

export interface Recurrence {
  recurrenceType: string;
  weekNumber: number;
}

export interface MentorSessionsByDate {
  [date: string]: MentorshipSession[];
}

export interface MentorSessionsResponse {
  username: string;
  sessionsByDate: MentorSessionsByDate;
}

/**
 * Interface representing a group mentorship session
 * Maps to the backend GroupMentorshipSession class
 */
export interface GroupMentorshipSession {
  sessionId: string;
  date: string; // Date in format YYYY-MM-DD
  startTime: string; // 24-hour format HH:mm
  endTime: string; // 24-hour format HH:mm
  mentorUserName: string;
  mentorName: string;
  mentorEmail: string;
  zoomLink?: string;
  zoomMeetingInfo?: ZoomMeetingInfo;
  name?: string;
  description?: string;
}

/**
 * Interface representing a mentorship group
 * Maps to the backend MentorshipGroup class
 */
export interface MentorshipGroup {
  groupId: string;
  groupFriendlyName: string;
  criterion: string;
  sessions: GroupMentorshipSession[];
  deleted: boolean;
  menteeCount: number;
  course: string;
}

/**
 * Interface representing the response for mentorship groups
 * Maps to the backend MentorshipGroupsResponse class
 */
export interface MentorshipGroupsResponse {
  mentorshipGroups: MentorshipGroup[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  recordingLink?: string;
  notes?: string;
}

export interface SuggestedInterval {
  start: string;
  end: string;
}

/**
 * Enum representing the type of update operation for a session
 */
export enum UpdateType {
  ADD = 'ADD',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE'
}

/**
 * Enum representing the type of session
 */
export enum SessionType {
  SCHEDULED = 'SCHEDULED',
  AD_HOC = 'AD_HOC'
}

/**
 * Interface representing a session update request
 * Maps to the backend SessionUpdate class
 */
export interface SessionUpdate {
  id: string;
  date: DateFormatDDMMYYYY;
  menteeUsername: string;
  menteeFullName: string;
  updateType: UpdateType;
  isPermanentUpdate: boolean;
  startTime?: string;
  endTime?: string;
  sessionType?: SessionType;
}

export interface RecurringMentorshipSchedule {

  sessionId: string;
  menteeUsername: string;
  menteeFullName: string;
  startTime: string;
  endTime: string;
  recurrenceType: RecurrenceType;
  firstSessionDate: string;
  dayOfWeek: string;
}


export enum RecurrenceType {
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
}

// Create a string literal type for the date format dd/mm/yyyy
export type DateFormatDDMMYYYY = string & { __brand: 'DateFormatDDMMYYYY' };

/**
 * Validates and creates a DateFormatDDMMYYYY type from a string
 * @param date - the date string to validate
 * @returns the date string as DateFormatDDMMYYYY type or null if invalid
 */
export function createDateDDMMYYYY(date: string): DateFormatDDMMYYYY | null {
  // Validate the date format is dd/mm/yyyy
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  
  if (!regex.test(date)) {
    return null;
  }
  
  // Further validate the date is actually valid (e.g., not 31/02/2023)
  const [day, month, year] = date.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }
  
  return date as DateFormatDDMMYYYY;
}

export interface DeleteRecurringSessionRequest {
  sessionId: string;
  dayOfWeek: DayOfWeek;
}