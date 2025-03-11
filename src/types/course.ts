export interface Course {
  name: string;
  description: string;
  isOneOnOneMentorshipCourse: boolean;
  endDate: string;
}

export interface CourseGroup {
  id: string;
  name: string;
  menteeCount: number;
  mentorAssigned: boolean;
}
