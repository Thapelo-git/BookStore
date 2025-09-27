import React from 'react';
import { Book } from '../types/book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Status Badge */}
      <div className={`px-4 py-2 text-xs font-semibold ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {book.available ? '✓ Available' : '✗ Unavailable'}
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium">{book.author}</span>
        </div>

        {/* Book Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <span className="text-gray-500">ISBN:</span>
            <div className="font-mono text-gray-800">{book.isbn}</div>
          </div>
          <div>
            <span className="text-gray-500">Year:</span>
            <div className="font-semibold text-gray-800">{book.publishedYear}</div>
          </div>
          {book.genre && (
            <div className="col-span-2">
              <span className="text-gray-500">Genre:</span>
              <div className="text-gray-800">{book.genre}</div>
            </div>
          )}
        </div>

        {/* Description */}
        {book.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(book)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};