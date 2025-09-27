import { useState, useEffect } from 'react';
import { Book, BookCreateRequest, BookUpdateRequest, BookQueryParams } from '../types/book';
import { bookAPI } from '../services/api';

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

  // Update the loadBooks method to use debounced search:
const loadBooks = async (params?: BookQueryParams): Promise<void> => {
  setLoading(true);
  setError(null);
  
  try {
    const queryParams = { ...filters, ...params };
    
    // Ensure page is reset to 1 when searching
    if (params?.search !== undefined && params.search !== filters.search) {
      queryParams.page = 1;
    }

    const response = await bookAPI.getBooks(queryParams);
    
    if (response.success && response.data) {
      setBooks(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
        setFilters(queryParams); // Update filters with the actual params used
      }
    } else {
      setError(response.message || 'Failed to load books');
    }
  } catch (err) {
    const error = err as Error;
    setError(error.message || 'An error occurred while loading books');
  } finally {
    setLoading(false);
  }
};

  const createBook = async (bookData: BookCreateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookAPI.createBook(bookData);
      if (response.success) {
        await loadBooks(); // Reload with current filters
        return true;
      } else {
        setError(response.message || 'Failed to create book');
        return false;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred while creating book');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, bookData: BookUpdateRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookAPI.updateBook(id, bookData);
      if (response.success) {
        await loadBooks(); // Reload with current filters
        return true;
      } else {
        setError(response.message || 'Failed to update book');
        return false;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred while updating book');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookAPI.deleteBook(id);
      if (response.success) {
        await loadBooks(); // Reload with current filters
        return true;
      } else {
        setError(response.message || 'Failed to delete book');
        return false;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred while deleting book');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

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
    setFilters
  };
};