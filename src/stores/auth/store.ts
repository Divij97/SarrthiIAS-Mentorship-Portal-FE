import { create } from 'zustand';
import { getMenteeByPhone } from '@/services/mentee';
import CryptoJS from 'crypto-js';
import { config } from '@/config/env';
import { Mentee } from '@/types/mentee';

interface LoginState {
  phone: string;
  password: string;
  error: string;
  loading: boolean;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  handleLogin: () => Promise<Mentee | null>;
  reset: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
  phone: '',
  password: '',
  error: '',
  loading: false,

  setPhone: (phone) => set({ phone }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),

  handleLogin: async () => {
    set({ error: '', loading: true });
    
    try {
      const { phone, password } = get();
      const hashedPassword = CryptoJS.SHA256(password + config.auth.salt).toString();
      const authHeader = `Basic ${btoa(`${phone}:${hashedPassword}`)}`;
      
      const response = await getMenteeByPhone(phone, authHeader);
      
      if (response.exists && response.mentee) {
        return response.mentee; // Will be handled by the component for routing
      } else {
        return null; // Will trigger signup redirect in component
      }
    } catch (error) {
      set({ error: 'Invalid credentials or server error' });
      console.error('Login error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({
    phone: '',
    password: '',
    error: '',
    loading: false
  })
})); 