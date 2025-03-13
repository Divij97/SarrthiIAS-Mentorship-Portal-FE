import { MentorshipSession } from '@/types/session';

// Define the structure for sessions data
export interface SessionsData {
  sessionsByDate: Record<string, MentorshipSession[]>;
}

// Helper function to generate dates for the next 7 days
const getNextSevenDays = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    dates.push(formattedDate);
  }
  
  return dates;
};
// Sample data for a MENTEE (one session per week with their assigned mentor)
export const sampleMenteeSessionsData: SessionsData = {
  sessionsByDate: getNextSevenDays().reduce((acc, date, index) => {
    // Only add a session for one day in the week (e.g., the first day)
    if (index === 0) {
      acc[date] = [
        {
          id: `session-${date}-1`,
          menteeFullName: "Rahul Kumar", // Current mentee
          menteeUsername: "9876543210",
          isZoomLinkGenerated: true,
          zoomLink: "https://zoom.us/j/123456789",
          startTime: "10:00",
          endTime: "11:00",
          mentorUsername: "mentor123",
          mentorName: "John Mentor"
        }
      ];
    } else {
      acc[date] = []; // No sessions on other days
    }
    return acc;
  }, {} as Record<string, MentorshipSession[]>)
};

// Sample data for a MENTOR (multiple sessions per day with different mentees)
export const sampleMentorSessionsData: SessionsData = {
  sessionsByDate: getNextSevenDays().reduce((acc, date, index) => {
    // Add 2-3 sessions for each day except Sunday (index 6)
    if (index !== 6) {
      acc[date] = [
        {
          id: `session-${date}-1`,
          menteeFullName: "Rahul Kumar",
          menteeUsername: "9876543210",
          isZoomLinkGenerated: index === 0, // Only today's sessions have zoom links
          zoomLink: index === 0 ? "https://zoom.us/j/123456789" : null,
          startTime: "10:00",
          endTime: "11:00",
          mentorUsername: "mentor123",
          mentorName: "John Mentor"
        },
        {
          id: `session-${date}-2`,
          menteeFullName: "Priya Sharma",
          menteeUsername: "9876543211",
          isZoomLinkGenerated: index === 0,
          zoomLink: index === 0 ? "https://zoom.us/j/987654321" : null,
          startTime: "14:30",
          endTime: "15:30",
          mentorUsername: "mentor123",
          mentorName: "John Mentor"
        }
      ];

      // Add a third session for some days (Monday, Wednesday, Friday)
      if (index % 2 === 0) {
        acc[date].push({
          id: `session-${date}-3`,
          menteeFullName: "Amit Patel",
          menteeUsername: "9876543212",
          isZoomLinkGenerated: index === 0,
          zoomLink: index === 0 ? "https://zoom.us/j/456789123" : null,
          startTime: "16:00",
          endTime: "17:00",
          mentorUsername: "mentor123",
          mentorName: "John Mentor"
        });
      }
    } else {
      acc[date] = []; // No sessions on Sunday
    }
    return acc;
  }, {} as Record<string, MentorshipSession[]>)
};

// Helper functions to get sessions based on user type
export const getSessionsByDate = (
  date: string,
  isMentor: boolean = false
): MentorshipSession[] => {
  const data = isMentor ? sampleMentorSessionsData : sampleMenteeSessionsData;
  return data.sessionsByDate[date] || [];
};

export const getAllSessions = (
  isMentor: boolean = false
): SessionsData => {
  return isMentor ? sampleMentorSessionsData : sampleMenteeSessionsData;
}; 