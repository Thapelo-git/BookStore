import { Request, Response } from "express";
import Review from "../models/reviewModel";
import { AuthRequest } from "../types/book";

/*
Create Review
POST /api/reviews
*/
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
     console.log("REVIEW BODY:", req.body);
    console.log("USER:", req.user);
    const { bookId, rating, comment, userName } = req.body;

    const reviewData: any = {
      book: bookId,
      rating,
      comment,
    };
 
    if (req.user?.id) {
      reviewData.user = req.user.id;
      reviewData.userName = req.user.name;
    } else {
      reviewData.userName = userName || "Anonymous";
    }

    const review = await Review.create(reviewData);

    const populatedReview = await review.populate("user", "name");

    res.status(201).json({
      success: true,
      data: populatedReview,
    });

  } catch (error: any) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already reviewed this book",
      });
    }

    console.error("CREATE REVIEW ERROR:", error);

res.status(500).json({
  message: error.message,
});
  }
};

/*
Get reviews for a book
GET /api/reviews/book/:bookId
*/
export const getBookReviews = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ book: bookId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

/*
Delete review
DELETE /api/reviews/:id
*/
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user?.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
    });
  }
};