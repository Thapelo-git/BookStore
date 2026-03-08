import React, { createContext, useContext, useState, useCallback } from 'react';
import { reviewService } from '../services/api';
export interface Review {
  id: string;
  bookId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewContextType {
  reviews: Review[];
  fetchReviews: (bookId: string) => Promise<void>;
  addReview: (
    bookId: string,
    userName: string,
    rating: number,
    comment: string
  ) => Promise<void>;
  getAverageRating: (bookId: string) => { average: number; count: number } | null;
}


const ReviewContext = createContext<ReviewContextType | undefined>(undefined);



export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = useCallback(async (bookId: string) => {
  try {
    const res = await reviewService.getBookReviews(bookId);

    const reviewsData = res.data?.data || [];
const formatted = reviewsData.map((r: any) => ({
  id: r._id,
  bookId: r.book,
  userName: r.user?.name || r.userName || "Anonymous",
  rating: r.rating,
  comment: r.comment,
  createdAt: new Date(r.createdAt).toISOString().split("T")[0],
}));

    setReviews(formatted);

  } catch (error) {
    console.error("Failed to fetch reviews", error);
  }
}, []);
const addReview = useCallback(
  async (bookId: string, userName: string, rating: number, comment: string) => {
    try {
      const res = await reviewService.createReview({
        bookId,
       userName,
        rating,
        comment,
      });

      const review = res.data?.data;

      const newReview: Review = {
        id: review._id,
        bookId: review.book,
        userName: review.user?.name || userName || "Anonymous",
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date(review.createdAt).toISOString().split("T")[0],
      };

      setReviews((prev) => [newReview, ...prev]);

    } catch (error) {
      console.error("Failed to add review", error);
    }
  },
  []
);

   const getAverageRating = useCallback(
    (bookId: string) => {
      const bookReviews = reviews.filter((r) => r.bookId === bookId);

      if (bookReviews.length === 0) return null;

      const avg =
        bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;

      return {
        average: Math.round(avg * 10) / 10,
        count: bookReviews.length,
      };
    },
    [reviews]
  );


 return (
    <ReviewContext.Provider
      value={{ reviews, fetchReviews, addReview, getAverageRating }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error("useReviews must be used within ReviewProvider");
  }

  return context;
}
