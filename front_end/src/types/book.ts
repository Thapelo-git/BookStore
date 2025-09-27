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