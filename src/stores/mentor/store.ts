import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mentor, MentorResponse } from '@/types/mentor';

interface MentorStore {
  mentor: Mentor | null;
  mentorResponse: MentorResponse | null;
  setMentor: (mentor: Mentor | null) => void;
  setMentorResponse: (response: MentorResponse | null) => void;
  clearMentor: () => void;
}

export const useMentorStore = create<MentorStore>()(
  persist(
    (set) => ({
      mentor: null,
      mentorResponse: null,
      setMentor: (mentor) => set({ mentor }),
      setMentorResponse: (response) => set({ mentorResponse: response }),
      clearMentor: () => set({ mentor: null, mentorResponse: null }),
    }),
    {
      name: 'mentor-storage', // unique name for localStorage key
    }
  )
); 