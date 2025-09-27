import React from 'react';
import type { Book } from '../types/book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
      <p className="text-gray-600 mb-1"><strong>Author:</strong> {book.author}</p>
      <p className="text-gray-600 mb-1"><strong>ISBN:</strong> {book.isbn}</p>
      <p className="text-gray-600 mb-1"><strong>Year:</strong> {book.publishedYear}</p>
      <p className="text-gray-600 mb-3">
        <strong>Status:</strong> 
        <span className={`ml-2 px-2 py-1 rounded text-xs ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {book.available ? 'Available' : 'Unavailable'}
        </span>
      </p>
      
      {book.genre && (
        <p className="text-gray-600 mb-3"><strong>Genre:</strong> {book.genre}</p>
      )}
      
      {book.description && (
        <p className="text-gray-700 mb-4 line-clamp-2">{book.description}</p>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(book)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};