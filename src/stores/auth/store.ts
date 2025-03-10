import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMenteeByPhone } from '@/services/mentee';
import { getMentorByPhone } from '@/services/mentors';
import CryptoJS from 'crypto-js';
import { config } from '@/config/env';
import { Mentee, MenteeResponse } from '@/types/mentee';
import { Mentor, MentorResponse } from '@/types/mentor';
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
  authHeader: string | null;
  userType: UserType | null;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setUserType: (type: UserType) => void;
  handleLogin: () => Promise<MenteeResponse | MentorResponse | null>;
  setAuthToken: (token: string) => void;
  logout: () => void;
  reset: () => void;
}

export const useLoginStore = create<AuthState>()(
  persist(
    (set, get) => {
      const handleMenteeLogin = async (phone: string, authHeader: string): Promise<MenteeResponse | null> => {
        const response = await getMenteeByPhone(phone, authHeader);
        if (response.mentee || response.isTempPassword) {
          set({ 
            authToken: authHeader,
            authHeader: authHeader,
            isAuthenticated: true
          });
          return response;
        }
        set({ error: 'Invalid credentials' });
        return null;
      };

      const handleMentorLogin = async (phone: string, authHeader: string): Promise<MentorResponse | null> => {
        const response = await getMentorByPhone(phone, authHeader);
        if (response.mentor) {
          set({ 
            authToken: authHeader,
            authHeader: authHeader,
            isAuthenticated: true
          });
          return response;
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
        authHeader: null,
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
            const passwordHash = CryptoJS.SHA256(password).toString();
            const testPassword = "password1";
            const credentials = btoa(`${phone}:${password}`);
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
            authHeader: null,
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
        authHeader: state.authHeader,
        userType: state.userType
      })
    }
  )
); 