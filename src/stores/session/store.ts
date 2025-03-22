import { create } from 'zustand';
import { MentorshipSession } from '@/types/session';
import { Meeting } from '@/types/meeting';
import { SessionManager } from '@/services/session-manager';
import { MenteeIdentifier, DayOfWeek, MentorResponse } from '@/types/mentor';
import { convertDateFormat, extractTimeFromISOString } from '@/utils/date-time-utils';

// Define modal state types
interface ModalState {
  isOpen: boolean;
}

interface EditModalState extends ModalState {
  formData: {
    startTime: string;
    endTime: string;
  };
}

interface AddModalState extends ModalState {
  formData: {
    date: string;
    startTime: string;
    endTime: string;
    menteeUsername: string;
    menteeFullName: string;
  };
}

interface CancelModalState extends ModalState {}

interface ModalsState {
  edit: EditModalState;
  add: AddModalState;
  cancel: CancelModalState;
  selectedSession: MentorshipSession | null;
  actionLoading: boolean;
  actionError: string | null;
}

interface SessionState {
  // Data state
  loading: boolean;
  error: string | null;
  sessionsByDate: Record<string, MentorshipSession[]>;
  calendarMeetings: Meeting[];
  menteeList: MenteeIdentifier[];
  loadingMentees: boolean;
  sessionManager: SessionManager | null;
  
  // UI state - organized into modals
  modals: ModalsState;
  
  // Getters for UI convenience
  readonly isEditModalOpen: boolean;
  readonly isCancelModalOpen: boolean;
  readonly isAddModalOpen: boolean;
  readonly editFormData: EditModalState['formData'];
  readonly addFormData: AddModalState['formData'];
  readonly selectedSession: MentorshipSession | null;
  readonly actionLoading: boolean;
  readonly actionError: string | null;
  
  // Setters
  setSessionManager: (manager: SessionManager) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Modal actions
  openEditModal: (session: MentorshipSession) => void;
  closeEditModal: () => void;
  openCancelModal: (session: MentorshipSession) => void;
  closeCancelModal: () => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  
  // Form actions
  updateEditFormField: (field: string, value: string) => void;
  updateAddFormField: (field: string, value: string) => void;
  
  // Data handling
  loadSessions: (mentorResponse: MentorResponse) => void;
  loadMenteeList: () => Promise<void>;
  
  // Session operations
  updateSession: (mentorResponse: MentorResponse, setMentorResponse: (response: MentorResponse) => void) => Promise<void>;
  cancelSession: (mentorResponse: MentorResponse, setMentorResponse: (response: MentorResponse) => void) => Promise<void>;
  addNewSession: (mentorResponse: MentorResponse, setMentorResponse: (response: MentorResponse) => void) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial data states
  loading: true,
  error: null,
  sessionsByDate: {},
  calendarMeetings: [],
  menteeList: [],
  loadingMentees: false,
  sessionManager: null,
  
  // Initial modal states
  modals: {
    edit: {
      isOpen: false,
      formData: { 
        startTime: '', 
        endTime: '' 
      }
    },
    add: {
      isOpen: false,
      formData: {
        date: '',
        startTime: '10:00',
        endTime: '11:00',
        menteeUsername: '',
        menteeFullName: ''
      }
    },
    cancel: {
      isOpen: false
    },
    selectedSession: null,
    actionLoading: false,
    actionError: null
  },
  
  // Getters for UI convenience (calculated properties)
  get isEditModalOpen() {
    return get().modals.edit.isOpen;
  },
  get isCancelModalOpen() {
    return get().modals.cancel.isOpen;
  },
  get isAddModalOpen() {
    return get().modals.add.isOpen;
  },
  get editFormData() {
    return get().modals.edit.formData;
  },
  get addFormData() {
    return get().modals.add.formData;
  },
  get selectedSession() {
    return get().modals.selectedSession;
  },
  get actionLoading() {
    return get().modals.actionLoading;
  },
  get actionError() {
    return get().modals.actionError;
  },
  
  // Setters
  setSessionManager: (manager) => set({ sessionManager: manager }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Modal actions
  openEditModal: (session) => {
    set((state) => ({
      modals: {
        ...state.modals,
        edit: {
          isOpen: true,
          formData: {
            startTime: extractTimeFromISOString(session.startTime),
            endTime: extractTimeFromISOString(session.endTime),
          }
        },
        selectedSession: session,
        actionError: null
      }
    }));
  },
  
  closeEditModal: () => set((state) => ({
    modals: {
      ...state.modals,
      edit: {
        ...state.modals.edit,
        isOpen: false
      }
    }
  })),
  
  openCancelModal: (session) => {
    set((state) => ({
      modals: {
        ...state.modals,
        cancel: {
          isOpen: true
        },
        selectedSession: session,
        actionError: null
      }
    }));
  },
  
  closeCancelModal: () => set((state) => ({
    modals: {
      ...state.modals,
      cancel: {
        ...state.modals.cancel,
        isOpen: false
      }
    }
  })),
  
  openAddModal: () => {
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    set((state) => ({
      modals: {
        ...state.modals,
        add: {
          isOpen: true,
          formData: {
            date: formattedDate,
            startTime: '10:00',
            endTime: '11:00',
            menteeUsername: '',
            menteeFullName: ''
          }
        },
        actionError: null
      }
    }));
    
    // Fetch mentee list if not already loaded
    const state = get();
    if (state.menteeList.length === 0 && state.sessionManager) {
      state.loadMenteeList();
    }
  },
  
  closeAddModal: () => set((state) => ({
    modals: {
      ...state.modals,
      add: {
        ...state.modals.add,
        isOpen: false
      }
    }
  })),
  
  // Form actions
  updateEditFormField: (field, value) => {
    set((state) => ({
      modals: {
        ...state.modals,
        edit: {
          ...state.modals.edit,
          formData: {
            ...state.modals.edit.formData,
            [field]: value
          }
        }
      }
    }));
  },
  
  updateAddFormField: (field, value) => {
    set((state) => ({
      modals: {
        ...state.modals,
        add: {
          ...state.modals.add,
          formData: {
            ...state.modals.add.formData,
            [field]: value
          }
        }
      }
    }));
  },
  
  // Data handling
  loadSessions: (mentorResponse) => {
    const mentorSessions = mentorResponse.sessionsByDate;
    const meetings: Meeting[] = [];
    
    Object.entries(mentorSessions).forEach(([date, sessions]) => {
      // Convert date format
      const formattedDate = convertDateFormat(date);
      
      sessions.forEach(session => {
        // Extract time from ISO string
        const startTime = extractTimeFromISOString(session.startTime);
        const endTime = extractTimeFromISOString(session.endTime);
        
        meetings.push({
          id: session.id,
          title: `Session with ${session.menteeFullName || session.menteeUsername || 'Mentee'}`,
          date: formattedDate,
          startTime: startTime,
          endTime: endTime,
          menteeUsername: session.menteeUsername,
          zoomLink: session.zoomLink,
        });
      });
    });
    
    set({
      sessionsByDate: mentorSessions,
      calendarMeetings: meetings,
      loading: false
    });
  },
  
  loadMenteeList: async () => {
    const { sessionManager } = get();
    if (!sessionManager) return;
    
    set({ loadingMentees: true });
    
    try {
      const mentees = await sessionManager.fetchMenteeList();
      set({ menteeList: mentees, loadingMentees: false });
      console.log('Mentee list loaded:', mentees);
    } catch (error) {
      console.error('Failed to load mentee list:', error);
      set((state) => ({ 
        modals: {
          ...state.modals,
          actionError: 'Failed to load mentee list. Please try again.'
        },
        loadingMentees: false
      }));
    }
  },
  
  // Session operations
  updateSession: async (mentorResponse, setMentorResponse) => {
    const { selectedSession, sessionManager } = get();
    const { formData } = get().modals.edit;
    
    if (!selectedSession || !sessionManager) return;
    
    set((state) => ({
      modals: {
        ...state.modals,
        actionLoading: true,
        actionError: null
      }
    }));
    
    try {
      // Call API to update session
      const updatedSession = await sessionManager.updateSessionSchedule(
        selectedSession.id,
        formData.startTime,
        formData.endTime
      );
      
      // Update local state with the updated session data
      const updatedSessions = { ...get().sessionsByDate };
      
      // Find which date contains this session
      Object.entries(updatedSessions).forEach(([date, sessions]) => {
        const sessionIndex = sessions.findIndex(s => s.id === selectedSession.id);
        if (sessionIndex !== -1) {
          // Update the session in place with the data from the API response
          updatedSessions[date][sessionIndex] = updatedSession;
        }
      });
      
      // Update calendar meetings
      const updatedMeetings = get().calendarMeetings.map(meeting => {
        if (meeting.id === selectedSession.id) {
          // Extract time from ISO string if needed
          const startTime = extractTimeFromISOString(updatedSession.startTime);
          const endTime = extractTimeFromISOString(updatedSession.endTime);
            
          return { 
            ...meeting, 
            startTime: startTime, 
            endTime: endTime 
          };
        }
        return meeting;
      });
      
      // Update in store (this would update localStorage)
      if (mentorResponse) {
        // Create a safe copy of the mentor response
        const updatedMentorResponse = { ...mentorResponse } as MentorResponse;
        
        // Update in sessionsByDate
        Object.entries(updatedMentorResponse.sessionsByDate).forEach(([date, sessions]) => {
          const sessionIndex = sessions.findIndex(s => s.id === selectedSession.id);
          if (sessionIndex !== -1) {
            updatedMentorResponse.sessionsByDate[date][sessionIndex] = updatedSession;
          }
        });
        
        // Update in sessionsByDayOfWeek if it exists
        if (updatedMentorResponse.sessionsByDayOfWeek) {
          Object.keys(updatedMentorResponse.sessionsByDayOfWeek).forEach((day) => {
            const dayKey = day as DayOfWeek;
            const sessions = updatedMentorResponse.sessionsByDayOfWeek[dayKey];
            
            if (sessions) {
              const sessionIndex = sessions.findIndex(s => s.id === selectedSession.id);
              
              if (sessionIndex !== -1) {
                const updatedSessions = [...sessions];
                updatedSessions[sessionIndex] = updatedSession;
                updatedMentorResponse.sessionsByDayOfWeek[dayKey] = updatedSessions;
              }
            }
          });
        }
        
        setMentorResponse(updatedMentorResponse);
      }
      
      set((state) => ({
        sessionsByDate: updatedSessions,
        calendarMeetings: updatedMeetings,
        modals: {
          ...state.modals,
          edit: {
            ...state.modals.edit,
            isOpen: false
          },
          actionLoading: false
        }
      }));
    } catch (error) {
      console.error('Failed to update session:', error);
      set((state) => ({
        modals: {
          ...state.modals,
          actionError: 'Failed to update session. Please try again.',
          actionLoading: false
        }
      }));
    }
  },
  
  cancelSession: async (mentorResponse, setMentorResponse) => {
    const { selectedSession, sessionManager } = get();
    
    if (!selectedSession || !sessionManager) return;
    
    set((state) => ({
      modals: {
        ...state.modals,
        actionLoading: true,
        actionError: null
      }
    }));
    
    try {
      // Call API to cancel session
      const result = await sessionManager.cancelSession(selectedSession.id);
      
      if (result.success) {
        // Remove session from local state
        const updatedSessions = { ...get().sessionsByDate };
        
        // Find and remove the session
        Object.entries(updatedSessions).forEach(([date, sessions]) => {
          updatedSessions[date] = sessions.filter(s => s.id !== selectedSession.id);
        });
        
        // Update calendar meetings
        const updatedMeetings = get().calendarMeetings.filter(
          meeting => meeting.id !== selectedSession.id
        );
        
        // Update in store (this would update localStorage)
        if (mentorResponse) {
          // Create a safe copy of the mentor response
          const updatedMentorResponse = { ...mentorResponse } as MentorResponse;
          
          // Remove from sessionsByDate
          Object.entries(updatedMentorResponse.sessionsByDate).forEach(([date, sessions]) => {
            updatedMentorResponse.sessionsByDate[date] = sessions.filter(s => s.id !== selectedSession.id);
          });
          
          // Remove from sessionsByDayOfWeek if it exists
          if (updatedMentorResponse.sessionsByDayOfWeek) {
            Object.keys(updatedMentorResponse.sessionsByDayOfWeek).forEach((day) => {
              const dayKey = day as DayOfWeek;
              const sessions = updatedMentorResponse.sessionsByDayOfWeek[dayKey];
              
              if (sessions) {
                updatedMentorResponse.sessionsByDayOfWeek[dayKey] = sessions.filter(
                  s => s.id !== selectedSession.id
                );
              }
            });
          }
          
          setMentorResponse(updatedMentorResponse);
        }
        
        set((state) => ({
          sessionsByDate: updatedSessions,
          calendarMeetings: updatedMeetings,
          modals: {
            ...state.modals,
            cancel: {
              ...state.modals.cancel,
              isOpen: false
            },
            actionLoading: false
          }
        }));
      } else {
        throw new Error('Failed to cancel session');
      }
    } catch (error) {
      console.error('Failed to cancel session:', error);
      set((state) => ({
        modals: {
          ...state.modals,
          actionError: 'Failed to cancel session. Please try again.',
          actionLoading: false
        }
      }));
    }
  },
  
  addNewSession: async (mentorResponse, setMentorResponse) => {
    const { sessionManager } = get();
    const { formData } = get().modals.add;
    
    if (!mentorResponse || !sessionManager) return;
    
    set((state) => ({
      modals: {
        ...state.modals,
        actionLoading: true,
        actionError: null
      }
    }));
    
    try {
      // Validate that the selected date is this week or next week
      const selectedDate = new Date(formData.date);
      const today = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(today.getDate() + 14);
      
      if (selectedDate < today) {
        set((state) => ({
          modals: {
            ...state.modals,
            actionError: 'Please select a date from today onward.',
            actionLoading: false
          }
        }));
        return;
      }
      
      if (selectedDate > twoWeeksFromNow) {
        set((state) => ({
          modals: {
            ...state.modals,
            actionError: 'Please select a date within the next two weeks.',
            actionLoading: false
          }
        }));
        return;
      }
      
      // Get the mentor username from mentorResponse
      const mentorUsername = mentorResponse.username || 'mentor';
      
      // Call API to add a new session
      await sessionManager.addNewSession(
        mentorUsername,
        formData.date,
        formData.startTime,
        formData.endTime,
        formData.menteeUsername,
        formData.menteeFullName
      );
      
      // Close the modal
      set((state) => ({
        modals: {
          ...state.modals,
          add: {
            ...state.modals.add,
            isOpen: false
          },
          actionLoading: false
        }
      }));
      
      // Force a page refresh to get updated data from the backend
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to add session:', error);
      set((state) => ({
        modals: {
          ...state.modals,
          actionError: 'Failed to add session. Please try again.',
          actionLoading: false
        }
      }));
    }
  }
})); 