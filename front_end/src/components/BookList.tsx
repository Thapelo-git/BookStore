import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Book, BookQueryParams } from '../types/book';

interface BookListProps {
  books?: Book[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters?: BookQueryParams;
  onEdit?: (book: Book) => void; // Make optional
  onDelete?: (id: string) => void; // Make optional
  onFiltersChange?: (filters: BookQueryParams) => void; // Make optional
  onRefresh?: () => void; // Make optional
}

const BookList: React.FC<BookListProps> = ({
  books,
  loading,
  error,
  pagination,
  filters,
  onEdit,
  onDelete,
  onFiltersChange,
  onRefresh
}) => {
  // Use useMemo for safe defaults
  const safeFilters = useMemo((): BookQueryParams => {
    return filters || {
      page: 1,
      limit: 9,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  }, [filters]);

  const safeBooks = useMemo((): Book[] => {
    return books || [];
  }, [books]);

  const safePagination = useMemo(() => {
    return pagination || {
      page: 1,
      limit: 9,
      total: 0,
      pages: 0
    };
  }, [pagination]);

  // Safe callback functions
  const safeOnFiltersChange = useCallback((newFilters: BookQueryParams) => {
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    } else {
      console.warn('onFiltersChange callback is not defined');
    }
  }, [onFiltersChange]);

  const safeOnEdit = useCallback((book: Book) => {
    if (onEdit) {
      onEdit(book);
    } else {
      console.warn('onEdit callback is not defined');
    }
  }, [onEdit]);

  const safeOnDelete = useCallback((id: string) => {
    if (onDelete) {
      onDelete(id);
    } else {
      console.warn('onDelete callback is not defined');
    }
  }, [onDelete]);

  const safeOnRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    } else {
      console.warn('onRefresh callback is not defined');
    }
  }, [onRefresh]);

  const [searchTerm, setSearchTerm] = useState(safeFilters.search || '');


  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== safeFilters.search) {
        safeOnFiltersChange({
          ...safeFilters,
          search: searchTerm,
          page: 1
        });
      }
    }, 500);

     return () => clearTimeout(timer);
  }, [searchTerm, safeFilters, safeOnFiltersChange]);

  // Trigger search when debounced term changes
  
const handleFilterChange = useCallback((key: keyof BookQueryParams, value: any) => {
    safeOnFiltersChange({
      ...safeFilters,
      [key]: value,
      page: key !== 'page' ? 1 : value
    });
  }, [safeFilters, safeOnFiltersChange]);

 const handlePageChange = useCallback((newPage: number) => {
    safeOnFiltersChange({
      ...safeFilters,
      page: newPage
    });
  }, [safeFilters, safeOnFiltersChange]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    safeOnFiltersChange({
      page: 1,
      limit: 9,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, [safeOnFiltersChange]);

  if (loading && safeBooks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Library</h1>
          <p className="text-gray-600 mt-2">
            Showing {safeBooks.length} of {safePagination.total} books
            {safeFilters.search && ` for "${safeFilters.search}"`}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={safeOnRefresh}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Refresh
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            Clear
          </button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <select
            value={safeFilters.available?.toString() || ''}
            onChange={(e) => handleFilterChange('available', 
              e.target.value === '' ? undefined : e.target.value === 'true'
            )}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Books</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>

          <select
            value={safeFilters.sortBy || 'title'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="publishedYear">Sort by Year</option>
            <option value="createdAt">Sort by Date Added</option>
          </select>

          <select
            value={safeFilters.sortOrder || 'asc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <select
            value={safeFilters.limit || 9}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="9">9 per page</option>
            <option value="18">18 per page</option>
            <option value="27">27 per page</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeBooks.map((book) => (
          <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    book.available 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {book.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3 font-medium">by {book.author}</p>
              
              {book.genre && (
                <p className="text-sm text-gray-500 mb-3">
                  <span className="font-medium">Genre:</span> {book.genre}
                </p>
              )}
              
              <div className="text-sm text-gray-500 mb-4 space-y-1">
                <p><span className="font-medium">Published:</span> {book.publishedYear}</p>
                <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
                {book.createdAt && (
                  <p><span className="font-medium">Added:</span> {new Date(book.createdAt).toLocaleDateString()}</p>
                )}
              </div>

              {book.description && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-3 bg-gray-50 p-3 rounded">
                  {book.description}
                </p>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={() => safeOnEdit(book)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => safeOnDelete(book._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {safeBooks.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-2 text-gray-500">
            {safeFilters.search ? 'Try adjusting your search terms or filters' : 'Get started by adding your first book'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {safePagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-6">
          <button
            onClick={() => handlePageChange(safePagination.page - 1)}
            disabled={safePagination.page <= 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {safePagination.page} of {safePagination.pages} ({safePagination.total} total books)
          </span>
          
          <button
            onClick={() => handlePageChange(safePagination.page + 1)}
            disabled={safePagination.page >= safePagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;