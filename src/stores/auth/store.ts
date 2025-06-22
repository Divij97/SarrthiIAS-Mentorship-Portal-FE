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
  handleLogin: (identifier: string) => Promise<MenteeResponse | MentorResponse | null>;
  setAuthHeader: (header: string) => void;
  getAuthHeader: () => string | null;
  logout: () => void;
  reset: () => void;
}

// Initialize store with cleanup for mentee
const initializeStore = () => {
  if (typeof window !== 'undefined') {
    const storedState = localStorage.getItem('auth-storage');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      if (parsedState.state?.userType === UserType.MENTEE) {
        // Clear mentee data from localStorage
        localStorage.removeItem('auth-storage');
        // Clear mentee store
        useMenteeStore.getState().clearMentee();
      }
    }
  }
};

// Call initialization
initializeStore();

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
        setUserType: (type) => {
          set({ userType: type });
          // Clear mentee data when switching to mentee type
          if (type === UserType.MENTEE) {
            useMenteeStore.getState().clearMentee();
          }
        },
        setHasVerifiedOTP: (value) => set({ hasVerifiedOTP: value }),
        setAuthHeader: (header) => set({ authHeader: header, isAuthenticated: true }),
        getAuthHeader: () => get().authHeader,

        handleLogin: async (identifier: string) => {
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
            const testPassword = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            const credentials = btoa(`${identifier}:${hashedPassword}`);
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
      partialize: (state) => {
        // Only persist data for mentors
        if (state.userType === UserType.MENTOR) {
          return { 
            isAuthenticated: state.isAuthenticated,
            phone: state.phone,
            userType: state.userType,
            hasVerifiedOTP: state.hasVerifiedOTP,
            authHeader: state.authHeader
          };
        }
        // For mentees, only persist userType
        return { userType: state.userType };
      }
    }
  )
);

// Add event listener for tab close
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const { userType } = useLoginStore.getState();
    if (userType === UserType.MENTEE) {
      useLoginStore.getState().logout();
    }
  });
} 