import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mentor, MentorResponse } from '@/types/mentor';
import { MentorshipSession } from '@/types/session';
import { DateFormatDDMMYYYY } from '@/types/session';

interface MentorStore {
  mentor: Mentor | null;
  mentorResponse: MentorResponse | null;
  setMentor: (mentor: Mentor | null) => void;
  setMentorResponse: (response: MentorResponse | null) => void;
  clearMentor: () => void;
  clearMentorOTP: () => void;
  addToSessionsByDate: (date: DateFormatDDMMYYYY, session: MentorshipSession) => void;
  removeFromSessionsByDate: (date: DateFormatDDMMYYYY, sessionId: string) => void;
}

export const useMentorStore = create<MentorStore>()(
  persist(
    (set, get) => ({
      mentor: null,
      mentorResponse: null,
      setMentor: (mentor) => set({ mentor }),
      setMentorResponse: (response) => set({ mentorResponse: response }),
      clearMentor: () => set({ mentor: null, mentorResponse: null }),
      clearMentorOTP: () => {
        const current = get().mentorResponse;
        if (current) {
          set({ 
            mentorResponse: { 
              ...current, 
              otp: null 
            } 
          });
        }
      },
      addToSessionsByDate: (date: DateFormatDDMMYYYY, session: MentorshipSession) => {
        const current = get().mentorResponse;
        if (current) {
          set({ 
            mentorResponse: { ...current, sessionsByDate: { ...current.sessionsByDate, [date]: [session] } }
          });
        }
      },
      removeFromSessionsByDate: (date: DateFormatDDMMYYYY, sessionId: string) => {
        const current = get().mentorResponse;
        if (current) {
          set({ 
            mentorResponse: { ...current, sessionsByDate: { ...current.sessionsByDate, [date]: current.sessionsByDate[date].filter(s => s.id !== sessionId) } }
          });
        }
      }
    }),
    {
      name: 'mentor-storage', // unique name for localStorage key
    }
  )
); 