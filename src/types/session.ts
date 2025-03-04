export interface MentorshipSession {
  id: string;
  menteeFullName: string;
  menteeUsername: string;
  isZoomLinkGenerated: boolean;
  zoomLink: string | null;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface MentorshipSessionsInfo {
  sessionsByDate: {
    [date: string]: MentorshipSession[]; // date in dd/mm/yyyy format
  };
} 