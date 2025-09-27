import axios, { AxiosError } from 'axios';
import { Book, BookCreateRequest, BookUpdateRequest, ApiResponse, BookQueryParams } from '../types/book';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const bookAPI = {
  // Update the getBooks method to properly handle query params:
getBooks: async (params: BookQueryParams = {}): Promise<ApiResponse<Book[]>> => {
  // Clean up params - remove undefined values
  const cleanParams: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = value.toString();
    }
  });

  const queryString = new URLSearchParams(cleanParams).toString();
  const url = queryString ? `/books?${queryString}` : '/books';
  
  const response = await api.get(url);
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