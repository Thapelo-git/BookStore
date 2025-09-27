import React, { useState } from 'react';
import { BookList } from '../components/BookList';
import { BookForm } from '../components/BookForm';
import { useBooks } from '../hooks/useBooks';
import type { Book, BookCreateRequest } from '../types/book';

export const Home: React.FC = () => {
  const { books, loading, error, createBook, updateBook, deleteBook, loadBooks } = useBooks();
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
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Store</h1>
          <p className="text-lg text-gray-600">Manage your book collection</p>
        </div>

        {(showForm || editingBook) ? (
          <BookForm
            book={editingBook || undefined}
            onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
            onCancel={handleCancel}
            loading={loading}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Book Collection</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add New Book
              </button>
            </div>

            <BookList
              books={books}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={loadBooks}
            />
          </>
        )}
      </div>
    </div>
  );
};