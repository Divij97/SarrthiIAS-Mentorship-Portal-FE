import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseGroupInfo, MenteeResponse } from '@/types/mentee';

interface MenteeStore {
  mentee: any | null; // Replace 'any' with proper Mentee type when available
  menteeResponse: MenteeResponse | null;
  courses: CourseGroupInfo[];
  setMentee: (mentee: any) => void;
  setMenteeResponse: (response: MenteeResponse) => void;
  setCourses: (courses: CourseGroupInfo[]) => void;
  clearMentee: () => void;
  clearMenteeOTP: () => void;
  reset: () => void;
  getGroupIdByCourseName: (courseId: string) => string | null;
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
      reset: () => set({ mentee: null, menteeResponse: null }),
      getGroupIdByCourseName: (courseId: string) => {
        const course = get().courses.find(c => c.course.id === courseId);
        return course?.assignedGroup || null;
      }
    }),
    {
      name: 'mentee-storage', // unique name for localStorage key
    }
  )
); 