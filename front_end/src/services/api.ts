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
  timeout: 15000,
  // Add default params to prevent undefined values
  params: {
    page: 1,
    limit: 9
  }
});

// Request counter for debugging
let requestCount = 0;

// Add token to requests
api.interceptors.request.use((config) => {
  requestCount++;
  console.log(`🚀 API Request #${requestCount}: ${config.method?.toUpperCase()} ${config.url}`, config.params);
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token attached to request');
  } else {
    console.log('⚠️ No token found in localStorage');
  }
  
  // Clean up params to remove undefined/empty values
  if (config.params) {
    Object.keys(config.params).forEach(key => {
      if (config.params[key] === undefined || config.params[key] === '' || config.params[key] === null) {
        delete config.params[key];
      }
    });
  }
  
  return config;
});

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  
     (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
      success: response.data?.success,
      data: response.data?.data ? 'EXISTS' : 'MISSING',
      dataIsArray: Array.isArray(response.data?.data),
      dataType: typeof response.data?.data,
      fullData: response.data // Be careful - this might be large
    });
    return response;
  },
   
  async (error) => {
    console.log(`❌ API Error #${requestCount}:`, {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });

    const originalRequest = error.config;
    
    // Enhanced rate limiting handling
    if (error.response?.status === 429) {
      const retryCount = originalRequest._retryCount || 0;
      
      if (retryCount < 3) { // Maximum 3 retries
        originalRequest._retryCount = retryCount + 1;
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
        
        console.log(`⏳ Rate limited. Retry ${retryCount + 1}/3 in ${backoffDelay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return api(originalRequest);
      } else {
        console.log('🚫 Maximum retry attempts reached for rate limiting');
        // Don't retry again, let the component handle it
      }
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('🔒 Authentication failed, redirecting to login');
      localStorage.removeItem('token');
      // Use window.location instead of navigate for interceptor
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.log('🌐 Network error - no response received');
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
  getAll: (params?: BookQueryParams) => {
    // Clean up params before sending
    const cleanParams: BookQueryParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof BookQueryParams];
        if (value !== undefined && value !== '' && value !== null) {
          cleanParams[key as keyof BookQueryParams] = value;
        }
      });
    }
    
    console.log('📚 Getting books with cleaned params:', cleanParams);
    return api.get('/books', { params: cleanParams });
  },
  
  getById: (id: string) => {
    console.log(`📖 Getting book by ID: ${id}`);
    return api.get(`/books/${id}`);
  },
  
  create: (book: BookCreateRequest) => {
    console.log('➕ Creating book:', book);
    return api.post('/books', book);
  },
  
  update: (id: string, book: BookUpdateRequest) => {
    console.log(`✏️ Updating book ${id}:`, book);
    return api.put(`/books/${id}`, book);
  },
  
  delete: (id: string) => {
    console.log(`🗑️ Deleting book: ${id}`);
    return api.delete(`/books/${id}`);
  },
  
  // Remove search endpoint if it's the same as getAll
  // search: (query: string, params?: BookQueryParams) =>
  //   api.get('/books/search', { 
  //     params: { search: query, ...params } 
  //   }),
};

export default api;