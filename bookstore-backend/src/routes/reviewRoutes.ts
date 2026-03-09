import express from "express";
import {
  createReview,
  getBookReviews,
  deleteReview,
} from "../controllers/reviewController";

import { auth,optionalAuth } from '../middleware/auth';
const router = express.Router();

/* Public route */
router.get("/book/:bookId", getBookReviews);

/* Protected routes */
router.post("/",optionalAuth,  createReview);

router.delete("/:id", auth, deleteReview);

export default router;