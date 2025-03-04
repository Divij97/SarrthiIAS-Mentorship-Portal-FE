import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMenteeByPhone } from '@/services/mentee';
import { getMentorByPhone } from '@/services/mentors';
import CryptoJS from 'crypto-js';
import { config } from '@/config/env';
import { Mentee } from '@/types/mentee';
import { Mentor } from '@/types/mentor';
import { UserType } from '@/types/auth';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';

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
  handleLogin: () => Promise<Mentee | Mentor | null>;
  setAuthToken: (token: string) => void;
  logout: () => void;
  reset: () => void;
}

export const useLoginStore = create<AuthState>()(
  persist(
    (set, get) => {
      const handleMenteeLogin = async (phone: string, authHeader: string): Promise<Mentee | null> => {
        const response = await getMenteeByPhone(phone, authHeader);
        if (response.exists && response.mentee) {
          set({ 
            authToken: authHeader,
            isAuthenticated: true
          });
          return response.mentee;
        } else if (!response.exists) {
          set({ 
            authToken: authHeader,
            isAuthenticated: true,
            error: '' 
          });
          return null;
        }
        set({ error: 'Invalid credentials' });
        return null;
      };

      const handleMentorLogin = async (phone: string, authHeader: string): Promise<Mentor | null> => {
        const response = await getMentorByPhone(phone, authHeader);
        if (response.exists && response.mentor) {
          set({ 
            authToken: authHeader,
            isAuthenticated: true
          });
          return response.mentor;
        } else if (!response.exists) {
          set({
            authToken: authHeader,
            isAuthenticated: true,
            error: ''
          });
          return response.mentor;
        }
        set({ error: 'Invalid credentials' });
        return null;
      };

      return {
        phone: '',
        password: '',
        error: '',
        loading: false,
        isAuthenticated: false,
        authToken: null,
        userType: UserType.MENTEE,

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
            const samplePassword = "d7ab64570223da4a53f50af195361e83bd205c194d7d5b6f4532f51dc0da9b92";
            const credentials = btoa(`${"+91"+phone}:${samplePassword}`);
            const authHeader = `Basic ${credentials}`;
            
            return userType === UserType.MENTOR 
              ? await handleMentorLogin(phone, authHeader)
              : await handleMenteeLogin(phone, authHeader);
          } catch (error) {
            set({ error: 'Invalid credentials or server error' });
            console.error('Login error:', error);
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        logout: () => {
          useMenteeStore.getState().clearMentee();
          useMentorStore.getState().clearMentor();
          set({
            isAuthenticated: false,
            authToken: null,
            phone: '',
            password: '',
            error: '',
            loading: false,
            userType: UserType.MENTEE
          });
        },

        reset: () => set({
          phone: '',
          password: '',
          error: '',
          loading: false,
          userType: UserType.MENTEE
        })
      };
    },
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