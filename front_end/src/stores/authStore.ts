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

        updateProfile: async (profileData: { name: string; email: string }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(profileData);
          const { data } = response;
          
          if (data.success) {
            set({ 
              user: data.data,
              isLoading: false 
            });
          } else {
            throw new Error(data.message || 'Failed to update profile');
          }
        } catch (err: unknown) {
          let errorMessage = 'Failed to update profile';
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

        changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.changePassword(passwordData);
          const { data } = response;
          
          if (data.success) {
            set({ isLoading: false });
          } else {
            throw new Error(data.message || 'Failed to change password');
          }
        } catch (err: unknown) {
          let errorMessage = 'Failed to change password';
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
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          const { data } = response;
          
          console.log('🔐 Login response:', data);
          
          if (data.success && data.token) {
            const { user, token } = data;
            
             localStorage.setItem('token', token);
            console.log('✅ Token saved to localStorage:', localStorage.getItem('token') ? 'SUCCESS' : 'FAILED');
            // Update state immediately
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            });
            
            console.log('✅ Login successful - state updated');
            return user;
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
          localStorage.removeItem('token');
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
            localStorage.setItem('token', token);
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
        localStorage.removeItem('token');
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
       version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from previous versions if needed
          return persistedState;
        }
        return persistedState;
      }
    }


    
  )
);