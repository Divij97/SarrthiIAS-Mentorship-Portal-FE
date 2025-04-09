import { Course, CreateDocumentRequest } from "./course";
import { MenteesForCsvExport, StrippedDownMentee } from "./mentee";
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

export enum ResourceType {
    COURSES = 'COURSES',
    MENTORS = 'MENTORS',
    MENTEES = 'MENTEES',
    GROUPS = 'GROUPS',
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

export interface DeleteGroupSessionsRequest {
    sessionIds: string[];
}

export interface MenteesResponse {
    mentees: MenteesForCsvExport[];
}

export interface AddDocumentsRequest {
    documents: CreateDocumentRequest[];
}

export enum CriterionCategory {
    INTERVIEW = 'INTERVIEW',
    MAINS_OR_INTERVIEW = 'MAINS_OR_INTERVIEW',
    MAINS_WITHOUT_INTERVIEW = 'MAINS_WITHOUT_INTERVIEW',
    ATTEMPTS = 'ATTEMPTS',
    DEFAULT = 'DEFAULT',
    GROUP_INTERVIEW = 'GROUP_INTERVIEW',
}

export interface CriterionSubCategory {
    name: string;
    value?: string;
    range: number;
}

export interface Criterion {
    category: CriterionCategory;
    subCategories: CriterionSubCategory[];
}

export interface CriterionSubCategoryRequest {
    category: CriterionCategory;  
    subCategories: string[] | null;
};

export interface MentorshipSessionsResponse {
    sessions: GroupMentorshipSession[];
}

export interface MentorAssignmentRequest {
    mentorUserName: string;
}
