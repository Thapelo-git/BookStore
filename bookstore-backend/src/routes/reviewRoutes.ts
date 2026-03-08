import express from "express";
import {
  createReview,
  getBookReviews,
  deleteReview,
} from "../controllers/reviewController";

import { auth } from '../middleware/auth';
const router = express.Router();

/* Public route */
router.get("/book/:bookId", getBookReviews);

/* Protected routes */
router.post("/",  createReview);

router.delete("/:id", auth, deleteReview);

export default router;