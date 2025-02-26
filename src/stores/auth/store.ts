import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserByPhone } from '@/services/mentee';
import CryptoJS from 'crypto-js';
import { config } from '@/config/env';
import { Mentee } from '@/types/mentee';
import { UserType } from '@/types/auth';
import { useMenteeStore } from '@/stores/mentee/store';

interface AuthState {
  phone: string;
  password: string;
  error: string;
  loading: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
  userType: UserType | null;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setUserType: (type: UserType) => void;
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
      userType: UserType.MENTEE, // Default to MENTEE

      setPhone: (phone) => set({ phone }),
      setPassword: (password) => set({ password }),
      setError: (error) => set({ error }),
      setUserType: (type) => set({ userType: type }),
      setAuthToken: (token) => set({ authToken: token, isAuthenticated: true }),

      handleLogin: async () => {
        const { phone, password, userType } = get();
        if (!userType) {
          set({ error: 'Please select user type' });
          return null;
        }

        set({ error: '', loading: true });
        
        try {
          const hashedPassword = CryptoJS.SHA256(password + config.auth.salt).toString();
          // Format the auth header as Basic Auth
          const samplePassword = "d7ab64570223da4a53f50af195361e83bd205c194d7d5b6f4532f51dc0da9b92";
          const credentials = btoa(`${"+91"+phone}:${samplePassword}`);
          const authHeader = `Basic ${credentials}`;
          
          console.log('Attempting login with:', {
            phone,
            userType,
            authHeader: authHeader.substring(0, 20) + '...' // Log partial header for security
          });
          
          const response = await getUserByPhone(phone, authHeader, UserType.MENTEE);
          
          if (response.exists && response.mentee) {
            // Store auth token and set authenticated state
            set({ 
              authToken: authHeader,
              isAuthenticated: true
            });
            return response.mentee;
          } else if (!response.exists) {
            // First time user - store auth token but redirect to signup
            set({ 
              authToken: authHeader,
              isAuthenticated: true,
              error: '' // Clear any existing errors
            });
            // Return null to indicate signup needed
            return null;
          } else {
            set({ error: 'Invalid credentials' });
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
          loading: false,
          userType: UserType.MENTEE // Reset to default MENTEE
        });
      },

      reset: () => set({
        phone: '',
        password: '',
        error: '',
        loading: false,
        userType: UserType.MENTEE // Reset to default MENTEE
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken,
        userType: state.userType
      })
    }
  )
); 