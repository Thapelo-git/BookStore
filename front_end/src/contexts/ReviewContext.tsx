import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewContextType {
  getReviews: (bookId: string) => Review[];
  addReview: (bookId: string, userName: string, rating: number, comment: string) => void;
  getAverageRating: (bookId: string) => { average: number; count: number } | null;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const initialReviews: Review[] = [
  { id: 'r1', bookId: '1', userName: 'Sarah M.', rating: 5, comment: 'Absolutely beautiful story. It made me reflect on my own life choices.', createdAt: '2025-12-15' },
  { id: 'r2', bookId: '1', userName: 'David K.', rating: 4, comment: 'Great concept and well-written. A bit slow in the middle but the ending is perfect.', createdAt: '2025-11-20' },
  { id: 'r3', bookId: '2', userName: 'Emily R.', rating: 5, comment: 'Life-changing book! I\'ve completely transformed my daily routines.', createdAt: '2026-01-10' },
  { id: 'r4', bookId: '3', userName: 'Michael T.', rating: 5, comment: 'Couldn\'t put it down. The twist at the end was incredible!', createdAt: '2025-10-05' },
  { id: 'r5', bookId: '5', userName: 'Jessica L.', rating: 4, comment: 'Beautifully written. The marsh descriptions are so vivid.', createdAt: '2026-02-01' },
];

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const getReviews = useCallback((bookId: string) => {
    return reviews.filter((r) => r.bookId === bookId);
  }, [reviews]);

  const addReview = useCallback((bookId: string, userName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `r-${Date.now()}`,
      bookId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);
  }, []);

  const getAverageRating = useCallback((bookId: string) => {
    const bookReviews = reviews.filter((r) => r.bookId === bookId);
    if (bookReviews.length === 0) return null;
    const avg = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
    return { average: Math.round(avg * 10) / 10, count: bookReviews.length };
  }, [reviews]);

  return (
    <ReviewContext.Provider value={{ getReviews, addReview, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReviews must be used within a ReviewProvider');
  return context;
}
