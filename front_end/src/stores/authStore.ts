// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Add this
import { isAxiosError } from 'axios';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/book';
import { authService } from '../services/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          const { data } = response;
          
          console.log('🔐 Login response:', data);
          
          if (data.success && data.token) {
            const { user, token } = data;
            
            // Update state immediately
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            });
            
            console.log('✅ Login successful - state updated');
            return;
          } else {
            throw new Error(data.message || 'Login failed');
          }
        } catch (err: unknown) {
          let errorMessage = 'Login failed';
          if (isAxiosError(err)) {
            errorMessage = err.response?.data?.message || err.message || errorMessage;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false,
            token: null,
            user: null
          });
          throw err;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(credentials);
          const { data } = response;
          
          if (data.success && data.token) {
            const { user, token } = data;
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            throw new Error(data.message || 'Registration failed');
          }
        } catch (err: unknown) {
          let errorMessage = 'Registration failed';
          if (isAxiosError(err)) {
            errorMessage = err.response?.data?.message || err.message || errorMessage;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw err;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // name for the storage
      // Only store token and user, not loading states
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);