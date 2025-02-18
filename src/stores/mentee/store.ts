import { create } from 'zustand';
import { Mentee } from '@/types/mentee';

interface MenteeStore {
  mentee: Mentee | null;
  setMentee: (mentee: Mentee | null) => void;
  clearMentee: () => void;
}

export const useMenteeStore = create<MenteeStore>((set) => ({
  mentee: null,
  setMentee: (mentee) => set({ mentee }),
  clearMentee: () => set({ mentee: null }),
})); 