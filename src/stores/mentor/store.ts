import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mentor } from '@/types/mentor';

interface MentorStore {
  mentor: Mentor | null;
  setMentor: (mentor: Mentor | null) => void;
  clearMentor: () => void;
}

export const useMentorStore = create<MentorStore>()(
  persist(
    (set) => ({
      mentor: null,
      setMentor: (mentor) => set({ mentor }),
      clearMentor: () => set({ mentor: null }),
    }),
    {
      name: 'mentor-storage', // unique name for localStorage key
    }
  )
); 