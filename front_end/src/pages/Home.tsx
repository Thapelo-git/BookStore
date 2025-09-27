import React, { useState, useEffect } from 'react';
import { BookList } from '../components/BookList';
import { BookForm } from '../components/BookForm';
import { useBooks } from '../hooks/useBooks';
import { Book, BookCreateRequest, BookQueryParams } from '../types/book';

export const Home: React.FC = () => {
  const { 
    books, 
    loading, 
    error, 
    pagination, 
    filters, 
    createBook, 
    updateBook, 
    deleteBook, 
    loadBooks, 
    setFilters 
  } = useBooks();
  
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleCreateBook = async (bookData: BookCreateRequest): Promise<boolean> => {
    const success = await createBook(bookData);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  const handleUpdateBook = async (bookData: BookCreateRequest): Promise<boolean> => {
    if (!editingBook) return false;
    const success = await updateBook(editingBook._id, bookData);
    if (success) {
      setEditingBook(null);
    }
    return success;
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      await deleteBook(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const handleFiltersChange = (newFilters: BookQueryParams) => {
    setFilters(newFilters);
    loadBooks(newFilters);
  };

  // Auto-refresh when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBooks(filters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.available, filters.sortBy, filters.sortOrder, filters.limit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BookStore Manager</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your book collection with advanced search, filtering, and pagination. 
            Keep track of your literary treasures effortlessly.
          </p>
        </div>

        {/* Main Content */}
        {(showForm || editingBook) ? (
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <BookForm
              book={editingBook || undefined}
              onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        ) : (
          <>
            {/* Stats and Add Button */}
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
              
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Book</span>
              </button>
            </div>

            {/* Book List with Search, Filters, and Pagination */}
            <BookList
              books={books}
              loading={loading}
              error={error}
              pagination={pagination}
              filters={filters}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFiltersChange={handleFiltersChange}
              onRefresh={() => loadBooks(filters)}
            />
          </>
        )}
      </div>
    </div>
  );
};