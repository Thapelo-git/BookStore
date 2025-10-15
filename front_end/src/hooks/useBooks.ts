import { useState, useEffect, useRef, useCallback } from 'react';
import { Book, BookCreateRequest, BookUpdateRequest, BookQueryParams } from '../types/book';
import { bookService } from '../services/api';
import { useAuthStore } from '../stores/authStore';
interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: BookQueryParams;
  loadBooks: (params?: BookQueryParams) => Promise<void>;
  createBook: (bookData: BookCreateRequest) => Promise<boolean>;
  updateBook: (id: string, bookData: BookUpdateRequest) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
  setFilters: (filters: BookQueryParams) => void;
  clearError: () => void;
}

export const useBooks = (): UseBooksReturn => {
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState<BookQueryParams>({
    page: 1,
    limit: 9,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Refs to prevent unnecessary re-renders
  const filtersRef = useRef(filters);
  const isMountedRef = useRef(true);
  const initialLoadDoneRef = useRef(false);

  const clearError = () => setError(null);

  // Stable loadBooks function - ONLY called manually
  const loadBooks = useCallback(async (params?: BookQueryParams): Promise<void> => {
    if (!isMountedRef.current) return;

     const currentToken = localStorage.getItem('token');
     const zustandToken = useAuthStore.getState().token;
    
    console.log('🔐 useBooks auth check:', {
      zustandToken: !!zustandToken,
      localStorageToken: !!currentToken,
      zustandAuthenticated: useAuthStore.getState().isAuthenticated
    });
    if (!currentToken) {
      console.error('❌ Cannot load books: No authentication token');
      setError('Please log in to access books');
      setBooks([]);
      return;
    }
    setLoading(true);
    setError(null);
    
     try {
      const queryParams = { ...filtersRef.current, ...params };
      console.log('📤 Loading books with token:', !!currentToken);

      const response = await bookService.getAll(queryParams);
      
      if (!isMountedRef.current) return;

      if (response.data.success) {
        let booksData: Book[] = [];
        
        if (Array.isArray(response.data.data)) {
          booksData = response.data.data;
        } else if (Array.isArray(response.data.books)) {
          booksData = response.data.books;
        } else {
          booksData = [];
        }

        console.log('📚 Books loaded:', booksData.length);
        setBooks(booksData);
        
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }

        filtersRef.current = queryParams;
        setFilters(queryParams);
      } else {
        const errorMsg = response.data.message || 'Failed to load books';
        setError(errorMsg);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        // Clear invalid token
        // localStorage.removeItem('token');
        // useAuthStore.getState().logout();
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred while loading books';
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);


  // Stable setFilters - only updates when actually changed
  const stableSetFilters = useCallback((newFilters: BookQueryParams) => {
    const mergedFilters = { ...filtersRef.current, ...newFilters };
    
    // Only update if filters actually changed
    if (JSON.stringify(mergedFilters) !== JSON.stringify(filtersRef.current)) {
      filtersRef.current = mergedFilters;
      setFilters(mergedFilters);
      // DON'T auto-call loadBooks here - let the component control when to load
    }
  }, []); // No dependencies

  // Stable CRUD operations
  const createBook = useCallback(async (bookData: BookCreateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookService.create(bookData);
      
      if (response.data.success) {
        // Reload books after creation
        await loadBooks(filtersRef.current);
        return true;
      } else {
        const errorMsg = response.data.message || 'Failed to create book';
        setError(errorMsg);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while creating book';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadBooks]);

  const updateBook = useCallback(async (id: string, bookData: BookUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookService.update(id, bookData);
      
      if (response.data.success) {
        await loadBooks(filtersRef.current);
        return true;
      } else {
        const errorMsg = response.data.message || 'Failed to update book';
        setError(errorMsg);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while updating book';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadBooks]);

  const deleteBook = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookService.delete(id);
      
      if (response.data.success) {
        // Optimistic update - remove from local state immediately
        setBooks(prev => prev.filter(book => book._id !== id));
        return true;
      } else {
        const errorMsg = response.data.message || 'Failed to delete book';
        setError(errorMsg);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while deleting book';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies

  // Load books ONLY ONCE on initial mount
  useEffect(() => {
    isMountedRef.current = true;
    
    const currentToken = localStorage.getItem('token');
    console.log('🎯 useBooks init - Token exists:', !!currentToken);
    
    if (currentToken && !initialLoadDoneRef.current) {
      console.log('🎯 Initial books load');
      initialLoadDoneRef.current = true;
      loadBooks();
    } else if (!currentToken) {
      console.log('⏸️ Skipping books load - no token');
      setBooks([]);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [loadBooks]);
  return {
    books,
    loading,
    error,
    pagination,
    filters,
    loadBooks,
    createBook,
    updateBook,
    deleteBook,
    setFilters: stableSetFilters,
    clearError
  };
};