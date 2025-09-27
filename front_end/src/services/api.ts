import axios from 'axios';
import type { Book, BookCreateRequest, BookUpdateRequest, ApiResponse } from '../types/book';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookAPI = {
  // Get all books
  getBooks: async (page = 1, limit = 10, search = ''): Promise<ApiResponse<Book[]>> => {
    const response = await api.get(`/books?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },

  // Get single book
  getBook: async (id: string): Promise<ApiResponse<Book>> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Create book
  createBook: async (bookData: BookCreateRequest): Promise<ApiResponse<Book>> => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Update book
  updateBook: async (id: string, bookData: BookUpdateRequest): Promise<ApiResponse<Book>> => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book
  deleteBook: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; database: string }> => {
    const response = await api.get('/health');
    return response.data;
  }
};