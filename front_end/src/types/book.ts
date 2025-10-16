export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  available: boolean;
  genre?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookCreateRequest {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  available?: boolean;
  genre?: string;
  description?: string;
}

export type BookUpdateRequest = Partial<BookCreateRequest>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BookQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  available?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
   updateProfile: (profileData: { name: string; email: string }) => Promise<void>;
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => Promise<void>;
}