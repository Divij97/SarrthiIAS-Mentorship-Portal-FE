import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseGroupInfo, MenteeResponse } from '@/types/mentee';

interface MenteeStore {
  menteeResponse: MenteeResponse | null;
  courses: CourseGroupInfo[];

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
      menteeResponse: null,
      courses: [],
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
      }
    }),
    {
      name: 'mentee-storage', // unique name for localStorage key
    }
  )
); 