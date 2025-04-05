import { Mentee } from "./mentee";
import { GroupMentorshipSession } from "./session";

export interface CreateCourseRequest {
  name: string;
  description: string;
  isOneOnOneMentorshipCourse: boolean;
  startDate: string;
  endDate: string;
  documents?: CreateDocumentRequest[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  isOneOnOneMentorshipCourse: boolean;
  startDate: string;
  endDate: string;
  retired: boolean;
  documents?: CourseDocuments[];
  assignmentStatus: AssigmentStatus;
}

export interface CourseGroup {
  id: string;
  name: string;
  menteeCount: number;
  mentorAssigned: boolean;
}


export interface CreateGroupRequest {
  groupFriendlyName: string;
  groupMentorshipSessions: GroupMentorshipSession[];
  mentees: Mentee[];
}

export interface MergeGroupRequest {
  groupIds: string[];
  groupFriendlyName: string;
  groupMentorshipSessions: GroupMentorshipSession[];
  courseName: string;
}

export interface CourseDocuments {
  url: string;
  name: string;
  description: string;
  disclaimer: string;
}

export interface CreateDocumentRequest {
  name: string;
  description: string;
  url: string;
  disclaimer: string;
}

export enum AssigmentStatus {
  NOT_TRIGGERED = "NOT_TRIGGERED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}
