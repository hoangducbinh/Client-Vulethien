import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  customer: any;
  setToken: (token: string) => void;
  setAuthenticated: (auth: boolean) => void;
  setCustomer: (customer: any) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      customer: null,
      setToken: (token) => set({ token, isAuthenticated: true }),
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setCustomer: (customer) => set({ customer }),
      logout: () => {
        set({ token: null, isAuthenticated: false, customer: null });
        localStorage.removeItem('auth-storage');
      }
    }),
    {
      name: 'auth-storage',
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
      },
    }
  )
);

export default useAuthStore;