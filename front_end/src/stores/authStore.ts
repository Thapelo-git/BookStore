import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/book';
import { authService } from '../services/api';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const { data } = response;
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, token } = data.data;
      localStorage.setItem('token', token);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: unknown) {
      let errorMessage = 'Login failed';
      
      if (typeof err === 'object' && err !== null) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw err;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(credentials);
      const { data } = response;
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user, token } = data.data;
      localStorage.setItem('token', token);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: unknown) {
      let errorMessage = 'Registration failed';
      
      if (typeof err === 'object' && err !== null) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
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
}));