import { MentorSessionsResponse } from '@/types/session';

export const sampleMentorSessions: MentorSessionsResponse = {
  username: "8441097970",
  sessionsByDate: {
    "20/03/2024": [{
      id: "session-0",
      mn: "Divij Chopra",
      mu: "9810889059",
      isZoomLinkGenerated: true,
      z: "https://zoom.us/j/1000000",
      st: "2024-03-20T10:00:00+05:30",
      et: "2024-03-20T11:00:00+05:30",
      u: "8441097970",
      m: "Aditya Sharma"
    }],
    "21/03/2024": [],
    "22/03/2024": [{
      id: "session-2",
      mn: "Shivin Vyas",
      mu: "6367883481",
      isZoomLinkGenerated: true,
      z: "https://zoom.us/j/2000000",
      st: "2024-03-22T14:00:00+05:30",
      et: "2024-03-22T15:00:00+05:30",
      u: "8441097970",
      m: "Aditya Sharma"
    }],
    "23/03/2024": [],
    "24/03/2024": [{
      id: "session-3",
      mn: "Sajal Shah",
      mu: "7023545583",
      isZoomLinkGenerated: false,
      z: null,
      st: "2024-03-24T16:00:00+05:30",
      et: "2024-03-24T17:00:00+05:30",
      u: "8441097970",
      m: "Aditya Sharma"
    }]
  }
}; 