import { Course } from "./course";
import { Mentor } from "./mentor";

export interface AdminData {
    username: string;
    courses: any[];
    mentors: any[];
}

export interface AdminResponse {
    success: boolean;
    message?: string;
    data?: AdminData;
}