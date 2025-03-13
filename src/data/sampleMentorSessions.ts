import { MentorSessionsResponse } from '@/types/session';

export const sampleMentorSessions: MentorSessionsResponse = {
  username: "8441097970",
  sessionsByDate: {
    "20/03/2024": [{
      id: "session-0",
      menteeFullName: "Divij Chopra",
      menteeUsername: "9810889059",
      isZoomLinkGenerated: true,
      zoomLink: "https://zoom.us/j/1000000",
      startTime: "2024-03-20T10:00:00+05:30",
      endTime: "2024-03-20T11:00:00+05:30",
      mentorUsername: "8441097970",
      mentorName: "Aditya Sharma"
    }],
    "21/03/2024": [],
    "22/03/2024": [{
      id: "session-2",
      menteeFullName: "Shivin Vyas",
      menteeUsername: "6367883481",
      isZoomLinkGenerated: true,
      zoomLink: "https://zoom.us/j/2000000",
      startTime: "2024-03-22T14:00:00+05:30",
      endTime: "2024-03-22T15:00:00+05:30",
      mentorUsername: "8441097970",
      mentorName: "Aditya Sharma"
    }],
    "23/03/2024": [],
    "24/03/2024": [{
      id: "session-3",
      menteeFullName: "Sajal Shah",
      menteeUsername: "7023545583",
      isZoomLinkGenerated: false,
      zoomLink: null,
      startTime: "2024-03-24T16:00:00+05:30",
      endTime: "2024-03-24T17:00:00+05:30",
      mentorUsername: "8441097970",
      mentorName: "Aditya Sharma"
    }]
  }
}; 