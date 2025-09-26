import mongoose, { Schema } from 'mongoose';

const BookSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Book', BookSchema);