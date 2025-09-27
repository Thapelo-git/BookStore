import { useState, useEffect } from 'react';
import type { Book, BookCreateRequest, BookUpdateRequest } from '../types/book';
import { bookAPI } from '../services/api';

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
  loadBooks: () => Promise<void>;
  createBook: (bookData: BookCreateRequest) => Promise<boolean>;
  updateBook: (id: string, bookData: BookUpdateRequest) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
}

export const useBooks = (): UseBooksReturn => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookAPI.getBooks();
      if (response.success && response.data) {
        setBooks(response.data);
      } else {
        setError(response.message || 'Failed to load books');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
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
        await loadBooks();
        return true;
      } else {
        setError(response.message || 'Failed to create book');
        return false;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
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
        await loadBooks();
        return true;
      } else {
        setError(response.message || 'Failed to update book');
        return false;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
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
        await loadBooks();
        return true;
      } else {
        setError(response.message || 'Failed to delete book');
        return false;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
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
    loadBooks,
    createBook,
    updateBook,
    deleteBook
  };
};