import { GroupMentorshipSession, RecurrenceType } from "./session";
import { CriterionSubCategoryRequest } from "./admin";

export interface CreateCourseRequest {
  name: string;
  description: string;
  isOneOnOneMentorshipCourse: boolean;
  startDate: string;
  endDate: string;
  documents?: CreateDocumentRequest[];
  recurrenceType?: RecurrenceType;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  isOneOnOneMentorshipCourse: boolean;
  startDate: string;
  endDate: string;
  deleted: boolean;
  documents?: CourseDocuments[];
  assignmentStatus: AssigmentStatus;
  recurrenceType?: RecurrenceType;
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
  criterion: CriterionSubCategoryRequest;
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
