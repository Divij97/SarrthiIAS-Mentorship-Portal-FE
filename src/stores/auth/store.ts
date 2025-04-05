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
import { SecureStorage } from '@/utils/secure-storage';

interface AuthState {
  phone: string;
  password: string;
  error: string;
  loading: boolean;
  isAuthenticated: boolean;
  userType: UserType | null;
  hasVerifiedOTP: boolean;
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
        const response = await getMentorByPhone(phone, authHeader);
        if (response.isTempPassword || response.mentor) {
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

        setPhone: (phone) => set({ phone }),
        setPassword: (password) => set({ password }),
        setError: (error) => set({ error }),
        setUserType: (type) => set({ userType: type }),
        setHasVerifiedOTP: (value) => set({ hasVerifiedOTP: value }),
        setAuthHeader: (header) => {
          SecureStorage.setItem('authHeader', header);
          set({ isAuthenticated: true });
        },
        getAuthHeader: () => SecureStorage.getItem('authHeader'),

        handleLogin: async () => {
          const { phone, password, userType } = get();
          if (!userType) {
            set({ error: 'Please select user type' });
            return null;
          }

          set({ error: '', loading: true });
          
          try {
            const hashedPassword = SHA256(password).toString();
            const credentials = btoa(`${phone}:${hashedPassword}`);
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
            set({ loading: false });
          }
        },

        logout: () => {
          useMenteeStore.getState().clearMentee();
          useMentorStore.getState().clearMentor();
          SecureStorage.removeItem('authHeader');
          set({
            isAuthenticated: false,
            phone: '',
            password: '',
            error: '',
            loading: false,
            userType: UserType.MENTEE,
            hasVerifiedOTP: false
          });
        },

        reset: () => {
          SecureStorage.clear();
          set({
            phone: '',
            password: '',
            error: '',
            loading: false,
            isAuthenticated: false,
            userType: UserType.MENTEE,
            hasVerifiedOTP: false
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
        hasVerifiedOTP: state.hasVerifiedOTP
      })
    }
  )
); 