import axios from 'axios';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  BookCreateRequest, 
  BookUpdateRequest,
  BookQueryParams
} from '../types/book';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  
  register: (credentials: RegisterCredentials) => 
    api.post('/auth/register', credentials),
  
  getProfile: () => api.get('/auth/profile'),
};

export const bookService = {
  getAll: (params?: BookQueryParams) => 
    api.get('/books', { params }),
  
  getById: (id: string) => 
    api.get(`/books/${id}`),
  
  create: (book: BookCreateRequest) => 
    api.post('/books', book),
  
  update: (id: string, book: BookUpdateRequest) => 
    api.put(`/books/${id}`, book),
  
  delete: (id: string) => 
    api.delete(`/books/${id}`),
  
  search: (query: string, params?: BookQueryParams) =>
    api.get('/books/search', { 
      params: { search: query, ...params } 
    }),
};

export default api;