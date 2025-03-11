export interface MentorshipSession {
  id: string;
  menteeFullName: string;
  menteeUsername: string;
  isZoomLinkGenerated: boolean;
  zoomLink: string | null;
  startTime: string;
  endTime: string;
}

export interface MentorSessionsByDate {
  [date: string]: MentorshipSession[];
}

export interface MentorSessionsResponse {
  username: string;
  sessionsByDate: MentorSessionsByDate;
}

// Helper function to format date as DD/MM/YYYY
export const formatDateKey = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format time as HH:mm
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

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