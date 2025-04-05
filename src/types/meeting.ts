import { SessionType } from './session';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  courseId?: string;
  groupId?: string;
  menteeUsername?: string;
  menteeFullName?: string;
  zoomLink?: string | null;
  originalDate?: string; // Original date in dd/mm/yyyy format
  sessionType: SessionType;
}

export interface GroupMeeting extends Meeting {
  isGroupSession: boolean;
  courseName: string;
  groupFriendlyName: string;
}

export interface ZoomMeetingInfo {
  joinUrl: string;
  startUrl: string;
  password: string;
  meetingId: number;
}