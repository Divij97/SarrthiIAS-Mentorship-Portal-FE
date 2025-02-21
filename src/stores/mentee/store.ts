import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mentee } from '@/types/mentee';

interface MenteeStore {
  mentee: Mentee | null;
  setMentee: (mentee: Mentee | null) => void;
  clearMentee: () => void;
}

export const useMenteeStore = create<MenteeStore>()(
  persist(
    (set) => ({
      mentee: null,
      setMentee: (mentee) => set({ mentee }),
      clearMentee: () => set({ mentee: null }),
    }),
    {
      name: 'mentee-storage', // unique name for localStorage key
    }
  )
); 