import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';

export class BookController {
  // GET /api/books - List all books
  async getBooks(req: Request, res: Response) {
    try {
      const books = await Book.find();
      res.status(200).json({
        success: true,
        data: books
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching books'
      });
    }
  }

  // GET /api/books/:id - Get single book
  async getBook(req: Request, res: Response) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching book'
      });
    }
  }

  // POST /api/books - Create book
  async createBook(req: Request, res: Response) {
    try {
      const book = new Book(req.body);
      const savedBook = await book.save();
      res.status(201).json({
        success: true,
        data: savedBook,
        message: 'Book created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error creating book'
      });
    }
  }

  // PUT /api/books/:id - Update book
  async updateBook(req: Request, res: Response) {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      res.status(200).json({
        success: true,
        data: book,
        message: 'Book updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating book'
      });
    }
  }

  // DELETE /api/books/:id - Delete book
  async deleteBook(req: Request, res: Response) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting book'
      });
    }
  }
}

export default new BookController();