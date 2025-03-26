import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenteeEnrolledCourseInfo, MenteeResponse } from '@/types/mentee';
import { Course } from '@/types/course';

interface MenteeStore {
  mentee: any | null; // Replace 'any' with proper Mentee type when available
  menteeResponse: MenteeResponse | null;
  courses: MenteeEnrolledCourseInfo[];
  setMentee: (mentee: any) => void;
  setMenteeResponse: (response: MenteeResponse) => void;
  setCourses: (courses: MenteeEnrolledCourseInfo[]) => void;
  clearMentee: () => void;
  clearMenteeOTP: () => void;
  reset: () => void;
}

export const useMenteeStore = create<MenteeStore>()(
  persist(
    (set, get) => ({
      mentee: null,
      menteeResponse: null,
      courses: [],
      setMentee: (mentee) => set({ mentee }),
      setMenteeResponse: (response) => set({ menteeResponse: response }),
      setCourses: (courses) => set({ courses }),
      clearMentee: () => set({ mentee: null, courses: [] }),
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
      reset: () => set({ mentee: null, menteeResponse: null })
    }),
    {
      name: 'mentee-storage', // unique name for localStorage key
    }
  )
); 