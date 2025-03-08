import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mentee } from '@/types/mentee';
import { Course } from '@/types/course';

interface MenteeStore {
  mentee: Mentee | null;
  courses: Course[];
  setMentee: (mentee: Mentee | null) => void;
  setCourses: (courses: Course[]) => void;
  clearMentee: () => void;
}

export const useMenteeStore = create<MenteeStore>()(
  persist(
    (set) => ({
      mentee: null,
      courses: [],
      setMentee: (mentee) => set({ mentee }),
      setCourses: (courses) => set({ courses }),
      clearMentee: () => set({ mentee: null, courses: [] }),
    }),
    {
      name: 'mentee-storage', // unique name for localStorage key
    }
  )
); 