import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMenteeByPhone } from '@/services/mentee';
import { getMentorByPhone } from '@/services/mentors';
import { MenteeResponse } from '@/types/mentee';
import { MentorResponse } from '@/types/mentor';
import { UserType } from '@/types/auth';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { SHA256 } from 'crypto-js';

// Create a reference to track login request status outside of the store
// This will prevent multiple login requests even in React StrictMode
let loginRequestInProgress = false;

interface AuthState {
  phone: string;
  password: string;
  error: string;
  loading: boolean;
  isAuthenticated: boolean;
  userType: UserType | null;
hasVerifiedOTP: boolean;
  authHeader: string | null;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setUserType: (type: UserType) => void;
  setHasVerifiedOTP: (value: boolean) => void;
  handleLogin: () => Promise<MenteeResponse | MentorResponse | null>;
  setAuthHeader: (header: string) => void;
  getAuthHeader: () => string | null;
  logout: () => void;
  reset: () => void;
}

export const useLoginStore = create<AuthState>()(
  persist(
    (set, get) => {
      const handleMenteeLogin = async (phone: string, authHeader: string): Promise<MenteeResponse | null> => {
        console.log('[Auth] Making mentee login request:', new Date().toISOString());
        const response = await getMenteeByPhone(phone, authHeader);
        if (response.mentee || response.isTempPassword) {
          set({ 
            isAuthenticated: true
          });
          return response;
        }
        set({ error: 'Invalid credentials' });
        return null;
      };

      const handleMentorLogin = async (phone: string, authHeader: string): Promise<MentorResponse | null> => {
        console.log('[Auth] Making mentor login request:', new Date().toISOString());
        const response = await getMentorByPhone(phone, authHeader);
        if (response.it || response.m) {
          set({ 
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
        userType: UserType.MENTEE,
        hasVerifiedOTP: false,
        authHeader: null,

        setPhone: (phone) => set({ phone }),
        setPassword: (password) => set({ password }),
        setError: (error) => set({ error }),
        setUserType: (type) => set({ userType: type }),
        setHasVerifiedOTP: (value) => set({ hasVerifiedOTP: value }),
        setAuthHeader: (header) => set({ authHeader: header, isAuthenticated: true }),
        getAuthHeader: () => get().authHeader,

        handleLogin: async () => {
          const { phone, password, userType, loading } = get();
          
          // Check if login request is already in progress
          if (loginRequestInProgress || loading) {
            console.log('[Auth] Login request already in progress, skipping duplicate request');
            return null;
          }
          
          if (!userType) {
            set({ error: 'Please select user type' });
            return null;
          }

          set({ error: '', loading: true });
          loginRequestInProgress = true;
          
          try {
            const hashedPassword = SHA256(password).toString();
            const testPassword = "59352b98b50d8e5f4feea06468d5bc8dab6a9889d108accdaeea4299df60d002"
            const credentials = btoa(`${phone}:${testPassword}`);
            const authHeader = `Basic ${credentials}`;
            
            const response = userType === UserType.MENTOR 
              ? await handleMentorLogin(phone, authHeader)
              : await handleMenteeLogin(phone, authHeader);

            // Set auth header only if login was successful
            if (response) {
              get().setAuthHeader(authHeader);
            }
            
            return response;
          } catch (error) {
            set({ error: 'Invalid credentials or server error' });
            console.error('Login error:', error);
            throw error;
          } finally {
            loginRequestInProgress = false;
            set({ loading: false });
          }
        },

        logout: () => {
          useMenteeStore.getState().clearMentee();
          useMentorStore.getState().clearMentor();
          set({
            isAuthenticated: false,
            phone: '',
            password: '',
            error: '',
            loading: false,
            userType: UserType.MENTEE,
            hasVerifiedOTP: false,
            authHeader: null
          });
        },

        reset: () => {
          set({
            phone: '',
            password: '',
            error: '',
            loading: false,
            isAuthenticated: false,
            userType: UserType.MENTEE,
            hasVerifiedOTP: false,
            authHeader: null
          });
        }
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        phone: state.phone,
        userType: state.userType,
        hasVerifiedOTP: state.hasVerifiedOTP,
        authHeader: state.authHeader
      })
    }
  )
); 