import React, { useState } from 'react';
import type { Book } from '../types/book';
import  { BookCard } from './BooKCard';
import { LoadingSpinner } from './LoadingSpinner';

interface BookListProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  loading,
  error,
  onEdit,
  onDelete,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button
          onClick={onRefresh}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">
          Books ({filteredBooks.length})
        </h2>
        
        <div className="flex space-x-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onRefresh}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No books found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-500 hover:text-blue-700 mt-2"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};