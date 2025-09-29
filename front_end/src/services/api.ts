import axios from 'axios';
import { Book, BookCreateRequest, BookUpdateRequest, ApiResponse, BookQueryParams } from '../types/book';

// Use environment variable for API URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const bookAPI = {
  getBooks: async (params: BookQueryParams = {}): Promise<ApiResponse<Book[]>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/books?${queryParams}`);
    return response.data;
  },

  getBook: async (id: string): Promise<ApiResponse<Book>> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: BookCreateRequest): Promise<ApiResponse<Book>> => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id: string, bookData: BookUpdateRequest): Promise<ApiResponse<Book>> => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; database: string }> => {
    const response = await api.get('/health');
    return response.data;
  }
};