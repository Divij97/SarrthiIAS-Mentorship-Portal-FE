import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMenteeByPhone } from '@/services/mentee';
import CryptoJS from 'crypto-js';
import { config } from '@/config/env';
import { Mentee } from '@/types/mentee';
import { useMenteeStore } from '@/stores/mentee/store';

interface AuthState {
  phone: string;
  password: string;
  error: string;
  loading: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  handleLogin: () => Promise<Mentee | null>;
  setAuthToken: (token: string) => void;
  logout: () => void;
  reset: () => void;
}

export const useLoginStore = create<AuthState>()(
  persist(
    (set, get) => ({
      phone: '',
      password: '',
      error: '',
      loading: false,
      isAuthenticated: false,
      authToken: null,

      setPhone: (phone) => set({ phone }),
      setPassword: (password) => set({ password }),
      setError: (error) => set({ error }),
      setAuthToken: (token) => set({ authToken: token, isAuthenticated: true }),

      handleLogin: async () => {
        set({ error: '', loading: true });
        
        try {
          const { phone, password } = get();
          const hashedPassword = CryptoJS.SHA256(password + config.auth.salt).toString();
          const authHeader = `Basic ${btoa(`${phone}:${hashedPassword}`)}`;
          
          const response = await getMenteeByPhone(phone, authHeader);
          
          if (response.exists && response.mentee) {
            // Store auth token and set authenticated state
            set({ 
              authToken: authHeader,
              isAuthenticated: true
            });
            return response.mentee;
          } else {
            return null;
          }
        } catch (error) {
          set({ error: 'Invalid credentials or server error' });
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        // Clear mentee data
        useMenteeStore.getState().clearMentee();
        // Clear auth state
        set({
          isAuthenticated: false,
          authToken: null,
          phone: '',
          password: '',
          error: '',
          loading: false
        });
      },

      reset: () => set({
        phone: '',
        password: '',
        error: '',
        loading: false
      })
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken
      })
    }
  )
); 