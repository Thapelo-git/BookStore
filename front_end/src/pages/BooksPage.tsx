// src/pages/BooksPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import BookList from '../components/BookList';
import { useBooks } from '../hooks/useBooks';
import { Book, BookQueryParams } from '../types/book';

const BooksPage: React.FC = () => {
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

  const handleEdit = (book: Book) => {
    window.location.href = `/books/edit/${book._id}`;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
    }
  };

  const handleFiltersChange = (newFilters: BookQueryParams) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
          <Link
            to="/books/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
          onRefresh={() => loadBooks(filters)}
        />
      </div>
    </div>
  );
};

export default BooksPage;