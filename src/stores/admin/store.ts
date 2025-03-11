import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginAdmin } from '@/services/admin';
import { AdminData } from '@/types/admin';

interface AdminState {
  username: string;
  isAuthenticated: boolean;
  authHeader: string | null;
  error: string;
  loading: boolean;
  adminData: AdminData | null;
  setUsername: (username: string) => void;
  setAuthHeader: (header: string) => void;
  setError: (error: string) => void;
  handleLogin: (username: string, password: string) => Promise<{ success: boolean; adminData: AdminData | null }>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      username: '',
      isAuthenticated: false,
      authHeader: null,
      error: '',
      loading: false,
      adminData: null,

      setUsername: (username) => set({ username }),
      setAuthHeader: (header) => set({ authHeader: header, isAuthenticated: true }),
      setError: (error) => set({ error }),

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
          adminData: null
        });
      }
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        authHeader: state.authHeader,
        username: state.username,
        adminData: state.adminData
      })
    }
  )
); 