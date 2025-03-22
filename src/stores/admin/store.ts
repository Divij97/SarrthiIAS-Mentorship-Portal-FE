import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginAdmin } from '@/services/admin';
import { AdminData } from '@/types/admin';
import { Course } from '@/types/course';
import { MentorshipGroup, GroupMentorshipSession } from '@/types/session';

// Map to store mentorship groups by course name
interface CourseGroupsMap {
  [courseName: string]: MentorshipGroup[];
}

interface AdminState {
  username: string;
  isAuthenticated: boolean;
  authHeader: string | null;
  error: string;
  loading: boolean;
  adminData: AdminData | null;
  courseGroups: CourseGroupsMap;
  setUsername: (username: string) => void;
  setAuthHeader: (header: string) => void;
  setError: (error: string) => void;
  handleLogin: (username: string, password: string) => Promise<{ success: boolean; adminData: AdminData | null }>;
  logout: () => void;
  addCourse: (course: Course) => void;
  // New functions for mentorship groups
  setCourseGroups: (courseName: string, groups: MentorshipGroup[]) => void;
  getCourseGroups: (courseName: string) => MentorshipGroup[] | null;
  clearCourseGroups: (courseName: string) => void;
  getGroupSessions: (courseName: string, groupId: string) => GroupMentorshipSession[] | null;
  getMentorUserNameByPhone: (phone: string) => string | null;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      username: '',
      isAuthenticated: false,
      authHeader: null,
      error: '',
      loading: false,
      adminData: null,
      courseGroups: {},

      setUsername: (username) => set({ username }),
      setAuthHeader: (header) => set({ authHeader: header, isAuthenticated: true }),
      setError: (error) => set({ error }),

      addCourse: (course) => set((state) => ({
        adminData: state.adminData ? {
          ...state.adminData,
          courses: [...(state.adminData.courses || []), course]
        } : null
      })),

      // New functions for mentorship groups
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

      clearCourseGroups: (courseName) => set((state) => {
        const newCourseGroups = { ...state.courseGroups };
        delete newCourseGroups[courseName];
        return { courseGroups: newCourseGroups };
      }),
      getGroupSessions: (courseName: string, groupId: string) => {
        const state = get();
        const courseGroups = state.courseGroups[courseName] || [];
        const group = courseGroups.find(g => g.id === groupId);
        return group?.sessions || [];
      },

      handleLogin: async (username: string, password: string) => {
        set({ error: '', loading: true });
        
        try {
          const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
          const response = await loginAdmin(username, password);
          
          if (response.success && response.data) {
            set({ 
              authHeader,
              isAuthenticated: true,
              username: response.data.username,
              error: '',
              adminData: response.data
            });
            return { success: true, adminData: response.data };
          }
          
          set({ error: response.message || 'Invalid credentials' });
          return { success: false, adminData: null };
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
          authHeader: null,
          error: '',
          loading: false,
          adminData: null,
          courseGroups: {}
        });
      }
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        authHeader: state.authHeader,
        username: state.username,
        adminData: state.adminData,
        courseGroups: state.courseGroups
      })
    }
  )
); 