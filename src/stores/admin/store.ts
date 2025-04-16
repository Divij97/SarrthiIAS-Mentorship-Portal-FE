import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { assignMenteesToCourseGroups } from '@/services/admin';
import { AdminData } from '@/types/admin';
import { MentorshipGroup } from '@/types/session';
import { useAdminAuthStore } from '../auth/admin-auth-store';

// Map to store mentorship groups by course name
interface CourseGroupsMap {
  [courseName: string]: MentorshipGroup[];
}

interface AdminState {
  error: string;
  loading: boolean;
  adminData: AdminData | null;
  courseGroups: CourseGroupsMap;
  setError: (error: string) => void;
  setAdminData: (data: AdminData | null) => void;
  // New functions for mentorship groups
  setCourseGroups: (courseName: string, groups: MentorshipGroup[]) => void;
  getCourseGroups: (courseName: string) => MentorshipGroup[] | null;
  clearCourseGroups: (courseName: string) => void;
  getMentorUserNameByPhone: (phone: string) => string | null;
  getGroupFriendlyName: (courseName: string, groupId: string) => string | null;
  assignMenteesToCourseGroups: (courseId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      error: '',
      loading: false,
      adminData: null,
      courseGroups: {},

      setError: (error) => set({ error }),
      setAdminData: (data) => set({ adminData: data }),

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

      getGroupFriendlyName: (courseName: string, groupId: string) => {
        const state = get();
        const courseGroups = state.courseGroups[courseName] || [];
        const group = courseGroups.find(g => g.groupId === groupId);
        return group?.groupFriendlyName || null;
      },

      assignMenteesToCourseGroups: async (courseId: string): Promise<void> => {
        try {
          const authHeader = useAdminAuthStore.getState().getAuthHeader();
          if (!authHeader) {
            throw new Error('No authentication header available');
          }
          await assignMenteesToCourseGroups(courseId, authHeader);
        } catch (error) {
          console.error('Error in store assignGroupsToCourse:', error);
          throw error;
        }
      }
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ 
        adminData: state.adminData,
        courseGroups: state.courseGroups
      })
    }
  )
); 