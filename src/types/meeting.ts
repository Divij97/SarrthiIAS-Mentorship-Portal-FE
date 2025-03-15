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
} 