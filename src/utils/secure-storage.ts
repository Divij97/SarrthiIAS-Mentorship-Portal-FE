import { AES, enc } from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_SECRET || 'your-secret-key';

export const SecureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // Encrypt the value before storing
      const encryptedValue = AES.encrypt(value, SECRET_KEY).toString();
      sessionStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  },

  getItem: (key: string): string | null => {
    try {
      const encryptedValue = sessionStorage.getItem(key);
      if (!encryptedValue) return null;
      
      // Decrypt the value
      const bytes = AES.decrypt(encryptedValue, SECRET_KEY);
      return bytes.toString(enc.Utf8);
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  },

  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
}; 