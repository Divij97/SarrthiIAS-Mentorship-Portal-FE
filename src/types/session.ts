export interface MentorshipSession {
  id: string;
  menteeFullName: string;
  menteeUsername: string;
  isZoomLinkGenerated: boolean;
  zoomLink: string | null;
  startTime: string;
  endTime: string;
  mentorUsername: string;
  mentorName: string;
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
  groupFriendlyName: string;
  sessionId: string;
  dateOfSession: number; // Day of month (1-31)
  startTime: string; // 24-hour format HH:mm
  endTime: string; // 24-hour format HH:mm
  mentorUserName: string;
  mentorName: string;
  zoomLink: string;
}

/**
 * Interface representing a mentorship group
 * Maps to the backend MentorshipGroup class
 */
export interface MentorshipGroup {
  id: string;
  sessions: GroupMentorshipSession[];
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
  date: string;
  menteeUsername: string;
  updateType: UpdateType;
  isPermanentUpdate: boolean;
  startTime?: string;
  endTime?: string;
  sessionType?: SessionType;
} 