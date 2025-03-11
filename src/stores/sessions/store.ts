import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MentorSessionsResponse } from '@/types/session';

interface SessionsStore {
  sessions: MentorSessionsResponse;
  setSessions: (sessions: MentorSessionsResponse) => void;
  clearSessions: () => void;
}

export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set) => ({
      sessions: { username: '', sessionsByDate: {} },
      setSessions: (sessions) => set({ sessions }),
      clearSessions: () => set({ sessions: { username: '', sessionsByDate: {} } }),
    }),
    {
      name: 'sessions-storage',
    }
  )
); 