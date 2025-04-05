import { Course } from "./course";
import { StrippedDownMentee } from "./mentee";
import { Mentor, StrippedDownMentor } from "./mentor";
import { GroupMentorshipSession } from "./session";
export interface AdminData {
    username: string;
    courses:  Course[];
    mentors: StrippedDownMentor[];
}

export interface AdminResponse {
    success: boolean;
    message?: string;
    data?: AdminData;
}

export interface CreateMenteeRequest {
    name: string;
    phone: string;
    email: string;
}

export interface CreateMentorRequest {
    name: string;
    phone: string;
    email: string;
}

export interface UpdateMenteeCourseRequest {
    menteesToAdd: string[];
    menteesToRemove: string[];
}

export interface CreateGroupRequest {
    groupFriendlyName: string;
    groupMentorshipSessions: GroupMentorshipSession[];
    mentees: StrippedDownMentee[];
}

export interface BulkMentorshipGroupCreateOrUpdateRequest {
    sessions: GroupMentorshipSession[];
}

export interface MenteesResponse {
    mentees: StrippedDownMentee[];
}
