import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MentorshipSessionsInfo } from '@/types/session';

interface SessionsStore {
  sessions: MentorshipSessionsInfo;
  setSessions: (sessions: MentorshipSessionsInfo) => void;
  clearSessions: () => void;
}

export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set) => ({
      sessions: { sessionsByDate: {} },
      setSessions: (sessions) => set({ sessions }),
      clearSessions: () => set({ sessions: { sessionsByDate: {} } }),
    }),
    {
      name: 'sessions-storage',
    }
  )
); 