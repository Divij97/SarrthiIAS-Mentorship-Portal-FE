import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { AdminData } from '@/types/admin';
import { loginAdmin, assignGroupsToCourse } from '@/services/admin';
import { Course } from '@/types/course';
import { GroupMentorshipSession, MentorshipGroup } from '@/types/session';

interface CourseGroupsMap {
  [courseName: string]: MentorshipGroup[];
}

interface AdminAuthState {
  username: string;
  isAuthenticated: boolean;
  adminData: AdminData | null;
  error: string;
  loading: boolean;
  courseGroups: CourseGroupsMap;
  // Secure in-memory storage for auth header
  _authHeader: string | null;
  // Public getter for auth header
  getAuthHeader: () => string | null;
  // Actions
  setUsername: (username: string) => void;
  setError: (error: string) => void;
  setAdminData: (data: AdminData | null) => void;
  addCourse: (course: Course) => void;
  handleLogin: (username: string, password: string) => Promise<{ success: true; adminData: AdminData } | { success: false; adminData: null }>;
  refreshAdmin: () => Promise<boolean>;
  logout: () => void;
  // New functions for mentorship groups
  setCourseGroups: (courseName: string, groups: MentorshipGroup[]) => void;
  getCourseGroups: (courseName: string) => MentorshipGroup[] | null;
  clearCourseGroups: (courseName: string) => void;
  getGroupSessions: (courseName: string, groupId: string) => GroupMentorshipSession[] | null;
  getMentorUserNameByPhone: (phone: string) => string | null;
  getMentorEmailByPhone: (phone: string) => string | null;
  getGroupFriendlyName: (courseName: string, groupId: string) => string | null;
  assignGroupsToCourse: (courseId: string, course: Course) => Promise<{ success: boolean; message?: string }>;
}

// Define the persisted state type
type PersistedState = Pick<AdminAuthState, 'isAuthenticated' | 'username' | 'adminData' | 'courseGroups'>;

// Define the persist options type
type AdminAuthPersistOptions = PersistOptions<AdminAuthState, PersistedState>;

const persistOptions: AdminAuthPersistOptions = {
  name: 'admin-auth-storage',
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state) => ({
    isAuthenticated: state.isAuthenticated,
    username: state.username,
    adminData: state.adminData,
    courseGroups: state.courseGroups
  })
};

const initialState: AdminAuthState = {
  username: '',
  isAuthenticated: false,
  adminData: null,
  error: '',
  loading: false,
  _authHeader: null,
  courseGroups: {},
  getAuthHeader: () => null,
  setUsername: () => {},
  setError: () => {},
  setAdminData: () => {},
  addCourse: () => {},
  handleLogin: async () => ({ success: false, adminData: null }),
  refreshAdmin: async () => false,
  logout: () => {},
  setCourseGroups: () => {},
  getCourseGroups: () => null,
  clearCourseGroups: () => {},
  getGroupSessions: () => null,
  getMentorUserNameByPhone: () => null,
  getMentorEmailByPhone: () => null,
  getGroupFriendlyName: () => null,
  assignGroupsToCourse: async () => ({ success: false })
};

export const useAdminAuthStore = create<AdminAuthState>()(
  persist<AdminAuthState, [], [], PersistedState>(
    (set, get) => ({
      ...initialState,
      getAuthHeader: () => get()._authHeader,

      setUsername: (username) => set({ username }),
      setError: (error) => set({ error }),
      setAdminData: (data) => set({ adminData: data }),

      refreshAdmin: async () => {
        const state = get();
        if (!state.adminData?.username || !state._authHeader) return false;
        try {
          const response = await loginAdmin(state._authHeader);
          set({ adminData: response });
          return true;
        } catch (error) {
          console.error('Error refreshing admin data:', error);
          return false;
        }
      },

      addCourse: (course) => set((state) => ({
        adminData: state.adminData ? {
          ...state.adminData,
          courses: [...(state.adminData.courses || []), course]
        } : null
      })),

      handleLogin: async (username: string, password: string) => {
        set({ error: '', loading: true });
        
        try {
          const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
          const response = await loginAdmin(authHeader);

          console.log('response', response);
          
          set({ 
            _authHeader: authHeader,
            isAuthenticated: true,
            username: response.username,
            error: '',
            adminData: response
          });
          return { success: true, adminData: response };
        } catch (error) {
          set({ error: 'An error occurred during login' });
          console.error('Admin login error:', error);
          return { success: false, adminData: null };
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({
          username: '',
          isAuthenticated: false,
          adminData: null,
          error: '',
          loading: false,
          _authHeader: null
        });
      },
      setCourseGroups: (courseName, groups) => set((state) => ({
        courseGroups: {
          ...state.courseGroups,
          [courseName]: groups
        }
      })),

      getCourseGroups: (courseName) => {
        const state = get();
        return state.courseGroups[courseName] || null;
      },

      getMentorUserNameByPhone: (phone) => {
        const state = get();
        return state.adminData?.mentors?.find(mentor => mentor.phone === phone)?.name || null;
      },

      getMentorEmailByPhone: (phone) => {
        const state = get();
        return state.adminData?.mentors?.find(mentor => mentor.phone === phone)?.email || null;
      },

      clearCourseGroups: (courseName) => set((state) => {
        const newCourseGroups = { ...state.courseGroups };
        delete newCourseGroups[courseName];
        return { courseGroups: newCourseGroups };
      }),

      getGroupSessions: (courseName: string, groupId: string) => {
        const state = get();
        const courseGroups = state.courseGroups[courseName] || [];
        const group = courseGroups.find(g => g.groupId === groupId);
        return group?.sessions || [];
      },

      getGroupFriendlyName: (courseName: string, groupId: string) => {
        const state = get();
        const courseGroups = state.courseGroups[courseName] || [];
        const group = courseGroups.find(g => g.groupId === groupId);
        return group?.groupFriendlyName || null;
      },

      assignGroupsToCourse: async (courseId: string, course: Course): Promise<{ success: boolean; message?: string }> => {
        try {
          const authHeader = get()._authHeader;
          if (!authHeader) {
            throw new Error('No authentication header available');
          }
          const result = await assignGroupsToCourse(courseId, authHeader, course);
          return { success: true, message: 'Groups assigned successfully' };
        } catch (error) {
          console.error('Error in store assignGroupsToCourse:', error);
          return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
      }
    }),
    persistOptions
  )
); 