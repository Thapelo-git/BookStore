import React from 'react';
import { Book } from '../types/book';
import { BookCard } from './BooKCard';
import { LoadingSpinner } from './LoadingSpinner';
import { Pagination } from './Pagination';
import { SearchFilters } from './SearchFilter';
import { BookQueryParams } from '../types/book';

interface BookListProps {
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
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onFiltersChange: (filters: BookQueryParams) => void;
  onRefresh: () => void;
}

export const BookList: React.FC<BookListProps> = ({
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
  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Unable to load books</h3>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        onSearch={onRefresh}
        loading={loading}
      />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Book Collection
          </h2>
          <p className="text-gray-600">
            Showing {books.length} of {pagination.total} books
            {pagination.pages > 1 && ` • Page ${pagination.page} of ${pagination.pages}`}
          </p>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Books Grid */}
      {!loading && books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or add a new book.</p>
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '', page: 1 })}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
};