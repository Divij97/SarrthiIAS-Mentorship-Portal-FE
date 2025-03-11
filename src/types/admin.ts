import { Course } from "./course";
import { Mentor } from "./mentor";

export interface AdminData {
    username: string;
    courses:  Course[];
    mentors: Mentor[];
}

export interface AdminResponse {
    success: boolean;
    message?: string;
    data?: AdminData;
}