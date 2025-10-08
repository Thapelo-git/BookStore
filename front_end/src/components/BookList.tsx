import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, BookQueryParams } from '../types/book';
import { bookService } from '../services/api';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BookQueryParams>({
    page: 1,
    limit: 10,
    available: undefined,
    sortBy: 'title',
    sortOrder: 'asc'
  });

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookService.getAll(filters);
      
      // Handle the ApiResponse structure
      if (response.data.success) {
        setBooks(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load books');
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to load books';
      
      if (typeof err === 'object' && err !== null) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleFilterChange = <K extends keyof BookQueryParams>(
  key: K,
  value: BookQueryParams[K]
) => {
  setFilters(prev => ({
    ...prev,
    [key]: value,
    page: 1,
  }));
};


  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const response = await bookService.delete(id);
      
      if (response.data.success) {
        setBooks(books.filter(book => book._id !== id));
        // Show success message or reload books
        await loadBooks();
      } else {
        setError(response.data.message || 'Failed to delete book');
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to delete book';
      
      if (typeof err === 'object' && err !== null) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
    }
  };

  const toggleAvailability = async (book: Book) => {
    try {
      const response = await bookService.update(book._id, {
        available: !book.available
      });
      
      if (response.data.success && response.data.data) {
        setBooks(books.map(b => 
          b._id === book._id ? response.data.data! : b
        ));
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to update book';
      
      if (typeof err === 'object' && err !== null) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      page: 1,
      limit: 10,
      available: undefined,
      sortBy: 'title',
      sortOrder: 'asc'
    });
  };

  if (loading) {
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
          <p className="text-gray-600 mt-2">Manage your book collection</p>
        </div>
        <Link
          to="/books/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
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
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            Clear
          </button>
        </form>

        <div className="flex gap-4 flex-wrap">
          <select
            value={filters.available?.toString() || ''}
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
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="publishedYear">Sort by Year</option>
            <option value="createdAt">Sort by Date Added</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => {
  const value = e.target.value;
  if (value === 'asc' || value === 'desc') {
    handleFilterChange('sortOrder', value);
  }
}}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
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
        {books.map((book) => (
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
              </div>

              {book.description && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-3 bg-gray-50 p-3 rounded">
                  {book.description}
                </p>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Link
                    to={`/books/edit/${book._id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
                
                <button
                  onClick={() => toggleAvailability(book)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    book.available
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
                  }`}
                >
                  {book.available ? 'Mark Unavailable' : 'Mark Available'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {books.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-2 text-gray-500">
            {filters.search ? 'Try adjusting your search terms or filters' : 'Get started by adding your first book'}
          </p>
          {!filters.search && (
            <div className="mt-6">
              <Link
                to="/books/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Add Your First Book
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;