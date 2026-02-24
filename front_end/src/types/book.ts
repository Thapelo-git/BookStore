export type UserRole = 'admin' | 'merchant' | 'client';
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
export interface BookCreateRequest {
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  category: string;
  stock: number;
  publishedDate: string;
  isbn: string;
  pages: number;
  language: string;
  featured?: boolean;
  bestseller?: boolean;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  merchantId: string;
  merchantName: string;
  publishedDate: string;
  isbn: string;
  pages: number;
  language: string;
  featured?: boolean;
  bestseller?: boolean;
}
export interface BookUpdateRequest extends Partial<BookCreateRequest> {}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Category {
  id?: string;
  name?: string;
  slug?: string;
  icon?: string;
  bookCount?: number;
}

export interface Order {
  id?: string;
  userId?: string;
  items?: CartItem[];
  total?: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  shippingAddress?: Address;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
export interface BookQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

