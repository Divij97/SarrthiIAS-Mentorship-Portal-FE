import { create } from 'zustand';
import { CourseGroupInfo, MenteeResponse, MenteeSession } from '@/types/mentee';
import { refreshSessions } from '@/services/mentee';

interface MenteeStore {
  menteeResponse: MenteeResponse | null;
  courses: CourseGroupInfo[];
  pastSessions: { [key: string]: MenteeSession[] };

  setMenteeResponse: (response: MenteeResponse) => void;
  setCourses: (courses: CourseGroupInfo[]) => void;
  clearMentee: () => void;
  clearMenteeOTP: () => void;
  reset: () => void;
  getGroupIdByCourseName: (courseId: string) => string | null;
  refreshSessions: (authHeader: string) => Promise<void>;
  setPastSessions: (pastSessions: { [key: string]: MenteeSession[] }) => void;
}

export const useMenteeStore = create<MenteeStore>()((set, get) => ({
  menteeResponse: null,
  courses: [],
  pastSessions: {},
  setMenteeResponse: (response) => set({ menteeResponse: response }),
  setCourses: (courses) => set({ courses }),
  clearMentee: () => set({ menteeResponse: null, courses: [] }),
  clearMenteeOTP: () => {
    const current = get().menteeResponse;
    if (current) {
      set({ 
        menteeResponse: { 
          ...current, 
          otp: null 
        } 
      });
    }
  },
  reset: () => set({ menteeResponse: null }),
  getGroupIdByCourseName: (courseId: string) => {
    const course = get().courses.find(c => c.course.id === courseId);
    return course?.assignedGroup || null;
  },
  refreshSessions: async (authHeader: string) => {
    const response = await refreshSessions(authHeader);
    set({ menteeResponse: {
      ...response,
      assignedMentor: {
        ...response.assignedMentor,
      },
      mentorshipSessions: {
        ...response.mentorshipSessions
      }
    } });
  },
  setPastSessions: (pastSessions: { [key: string]: MenteeSession[] }) => {
    console.log('pastSessions', pastSessions);
    set({ pastSessions });
  },
})); 