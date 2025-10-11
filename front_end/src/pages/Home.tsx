import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookList from '../components/BookList';
import { useBooks } from '../hooks/useBooks';
import { Book, BookQueryParams } from '../types/book';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    books, 
    loading, 
    error, 
    pagination, 
    filters, 
    deleteBook, 
    loadBooks, 
    setFilters 
  } = useBooks();

  // Stable callbacks
  const handleFiltersChange = useCallback((newFilters: BookQueryParams) => {
    setFilters(newFilters);
    loadBooks(newFilters); // Manual control of when to load
  }, [setFilters, loadBooks]);

  const handleEdit = useCallback((book: Book) => {
    navigate(`/books/edit/${book._id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
    }
  }, [deleteBook]);

  const handleRefresh = useCallback(() => {
    loadBooks(filters);
  }, [loadBooks, filters]);

  console.log('🏠 Home rendered'); // Add this to debug renders

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BookStore Manager</h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pagination.total}</div>
                <div className="text-sm text-gray-600">Total Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {books.filter(b => b.available).length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>
          
          <Link
            to="/books/new"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            Add New Book
          </Link>
        </div>

        <BookList
          books={books}
          loading={loading}
          error={error}
          pagination={pagination}
          filters={filters}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFiltersChange={handleFiltersChange}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default React.memo(Home); // Prevent unnecessary re-renders