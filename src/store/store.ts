import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false, // Default value
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      logout: () => {
        set({ isAuthenticated: false });
        localStorage.removeItem('auth-storage');
         // Clear the stored authentication state
      }
    }),
    {
      name: 'auth-storage', // Key for localStorage
      storage: {
        getItem: (key) => {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      }, // Custom storage adapter
    }
  )
);

export default useAuthStore;
