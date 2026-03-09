import mongoose, { Schema, Document } from "mongoose";

export interface ReviewDocument extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new mongoose.Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },

  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userName: {
    type: String,
    trim: true,
   default: "Anonymous",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
  max: 5,
  },
  comment: {
    type: String,
  },
}, { timestamps: true });
/*
Prevent duplicate review by same user
*/
reviewSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true } } }
);

const Review = mongoose.model<ReviewDocument>("Review", reviewSchema);

export default Review;