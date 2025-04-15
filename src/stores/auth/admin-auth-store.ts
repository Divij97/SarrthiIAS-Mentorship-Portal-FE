import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  updateCourse: (courseId: string, course: Course) => void;
  handleLogin: (username: string, password: string) => Promise<{ success: true; adminData: AdminData } | { success: false; adminData: null }>;
  refreshAdmin: () => Promise<boolean>;
  logout: () => void;
  // New functions for mentorship groups
  setCourseGroups: (courseName: string, groups: MentorshipGroup[]) => void;
  getCourseGroups: (courseId: string) => MentorshipGroup[];
  clearCourseGroups: (courseName: string) => void;
  getGroupSessions: (courseName: string, groupId: string) => GroupMentorshipSession[] | null;
  getMentorUserNameByPhone: (phone: string) => string | null;
  getMentorEmailByPhone: (phone: string) => string | null;
  getGroupFriendlyName: (courseName: string, groupId: string) => string | null;
  assignGroupsToCourse: (courseId: string, course: Course) => Promise<{ success: boolean; message?: string }>;
  removeCourse: (courseId: string) => void;
}

const initialState: AdminAuthState = {
  username: '',
  isAuthenticated: false,
  adminData: null,
  error: '',
  loading: false,
  _authHeader: null,
  courseGroups: {},
  // Function placeholders required by the interface
  getAuthHeader: () => null,
  setUsername: () => {},
  setError: () => {},
  setAdminData: () => {},
  addCourse: () => {},
  updateCourse: (courseId, course) => null,
  handleLogin: async () => ({ success: false, adminData: null }),
  refreshAdmin: async () => false,
  logout: () => {},
  setCourseGroups: () => {},
  getCourseGroups: () => [],
  clearCourseGroups: () => {},
  getGroupSessions: () => null,
  getMentorUserNameByPhone: () => null,
  getMentorEmailByPhone: () => null,
  getGroupFriendlyName: () => null,
  assignGroupsToCourse: async () => ({ success: false }),
  removeCourse: () => {}
};

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
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

      updateCourse: (courseId, updatedCourse) => set((state) => ({
        adminData: state.adminData ? {
          ...state.adminData,
          courses: [...(state.adminData.courses.filter((course) => course.id !== courseId)), updatedCourse]
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

      getCourseGroups: (courseId) => {
        const state = get();
        return state.courseGroups[courseId];
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
      },

      removeCourse: (courseId: string) => {
        set((state) => ({
          adminData: {
            ...state.adminData,
            courses: state.adminData?.courses?.filter(course => course.id !== courseId) || []
          }
        }));
      }
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
); 