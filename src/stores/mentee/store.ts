import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mentee } from '@/types/mentee';
import { Course } from '@/types/course';

interface MenteeResponse {
  otp: string;
  // Add other response fields as needed
}

interface MenteeStore {
  mentee: any | null; // Replace 'any' with proper Mentee type when available
  menteeResponse: MenteeResponse | null;
  courses: Course[];
  setMentee: (mentee: any) => void;
  setMenteeResponse: (response: MenteeResponse) => void;
  setCourses: (courses: Course[]) => void;
  clearMentee: () => void;
  reset: () => void;
}

export const useMenteeStore = create<MenteeStore>()(
  persist(
    (set) => ({
      mentee: null,
      menteeResponse: null,
      courses: [],
      setMentee: (mentee) => set({ mentee }),
      setMenteeResponse: (response) => set({ menteeResponse: response }),
      setCourses: (courses) => set({ courses }),
      clearMentee: () => set({ mentee: null, courses: [] }),
      reset: () => set({ mentee: null, menteeResponse: null })
    }),
    {
      name: 'mentee-storage', // unique name for localStorage key
    }
  )
); 