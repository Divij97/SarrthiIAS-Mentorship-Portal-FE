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

// Sample sessions data for development
export const sampleGroupSessions: { [groupId: string]: Session[] } = {
  'group-1': [
    {
      id: 'session-1',
      title: 'Introduction to UPSC CSE',
      description: 'Overview of the civil services examination pattern and preparation strategy',
      date: '2024-04-15',
      startTime: '10:00',
      endTime: '11:30',
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 'session-2',
      title: 'Indian Polity - Basic Structure',
      description: 'Understanding the fundamental structure of Indian Constitution',
      date: '2024-04-17',
      startTime: '15:00',
      endTime: '16:30',
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/xyz-uvwx-yz'
    },
    {
      id: 'session-3',
      title: 'Economics Fundamentals',
      description: 'Basic concepts of micro and macro economics',
      date: '2024-04-10',
      startTime: '11:00',
      endTime: '12:30',
      status: 'completed',
      recordingLink: 'https://drive.google.com/recording-1',
      notes: 'Covered basic economic concepts and their application in UPSC'
    }
  ],
  'group-2': [
    {
      id: 'session-4',
      title: 'Geography - Physical Features',
      description: 'Understanding physical geography of India',
      date: '2024-04-16',
      startTime: '14:00',
      endTime: '15:30',
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/mno-pqrs-tuv'
    }
  ]
}; 