import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DayOfWeek, Mentor, MentorResponse } from '@/types/mentor';
import { MentorshipSession } from '@/types/session';
import { DateFormatDDMMYYYY } from '@/types/session';
import { useLoginStore } from '../auth/store';
import { updateMentor as updateMentorAPI } from '@/services/mentors';

interface MentorStore {
  mentor: Mentor | null;
  mentorResponse: MentorResponse | null;
  setMentor: (mentor: Mentor | null) => void;
  setMentorResponse: (response: MentorResponse | null) => void;
  clearMentor: () => void;
  clearMentorOTP: () => void;
  addToSessionsByDate: (date: DateFormatDDMMYYYY, session: MentorshipSession) => void;
  removeFromSessionsByDate: (date: DateFormatDDMMYYYY, sessionId: string) => void;
  addToSessionsByDayOfWeek: (date: DateFormatDDMMYYYY, schedule: MentorshipSession) => void;
  removeFromSessionsByDayOfWeek: (dayOfWeek: DayOfWeek, scheduleId: string) => void;
  onMenteeScheduled: (menteeUserName: string) => void;
  getUnscheduledMenteeEmail: (menteeUserName: string) => string | null;
  updateMentor: (data: { displayName: string; displayEmail: string }) => Promise<void>;
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
              o: null 
            } 
          });
        }
      },
      addToSessionsByDate: (date: DateFormatDDMMYYYY, session: MentorshipSession) => {
        const current = get().mentorResponse;
        if (current) {
          set({ 
            mentorResponse: { 
              ...current, 
              sd: { 
                ...current.sd, 
                [date]: [...(current.sd[date] || []), session]
              } 
            }
          });
        }
      },
      removeFromSessionsByDate: (date: DateFormatDDMMYYYY, sessionId: string) => {
        const current = get().mentorResponse;
        if (current) {
          set({ 
            mentorResponse: { ...current, sd: { ...current.sd, [date]: current.sd[date].filter(s => s.id !== sessionId) } }
          });
        }
      },
      addToSessionsByDayOfWeek: (date: DateFormatDDMMYYYY, schedule: MentorshipSession) => {
        const current = get().mentorResponse;
        const getDayOfWeekFromDate = (dateString: string): DayOfWeek => {
          if (!dateString) return DayOfWeek.MONDAY;
          const date = new Date(dateString);
          const days = [
            DayOfWeek.SUNDAY,
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            DayOfWeek.SATURDAY
          ];
          return days[date.getDay()];
        };
        if (current) {
          set({ 
            mentorResponse: { ...current, sw: { ...current.sw, [getDayOfWeekFromDate(date)]: [schedule] } }
          });
        }
      },
      removeFromSessionsByDayOfWeek: (dayOfWeek: DayOfWeek, scheduleId: string) => {
        const current = get().mentorResponse;
        if (current) {
          set({ 
            mentorResponse: { ...current, sw: { ...current.sw, [dayOfWeek]: current.sw[dayOfWeek]?.filter(s => s.id !== scheduleId) } }
          });
        }
      },
      onMenteeScheduled: (menteeUserName: string) => {
        const current = get().mentorResponse;
        if (current) {
          const updatedMentee = current.am.find(
            m => m.p === menteeUserName
          );
          updatedMentee.iu = false;
          
          set({ 
            mentorResponse: { 
              ...current, 
              am: [ 
                ...current.am.filter(m => m.p !== menteeUserName), 
                updatedMentee 
              ]  
            } 
          });
        }
      },
      getUnscheduledMenteeEmail: (menteeUserName: string) => {
        const current = get().mentorResponse;
        if (current) {
          return current.am.find(m => m.p === menteeUserName)?.e || null;
        }
      },
      updateMentor: async (data: { displayName: string; displayEmail: string }) => {
        const { mentor } = get();
        const { authHeader, phone } = useLoginStore.getState();

        if (!mentor || !authHeader || !phone) {
          throw new Error("Mentor not found or not authenticated.");
        }

        await updateMentorAPI(
          {
            displayName: data.displayName,
            displayEmail: data.displayEmail,
            phone: phone,
          },
          authHeader
        );

        set({
          mentor: {
            ...mentor,
            displayName: data.displayName,
            displayEmail: data.displayEmail,
          },
        });
      },
    }),
    {
      name: 'mentor-storage', // unique name for localStorage key
    }
  )
); 