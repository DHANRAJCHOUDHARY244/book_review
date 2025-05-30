// src/controllers/book.controller.ts
import { Request, Response } from "express";
import Book from "@models/book.model";
import Review from "@models/review.model";
import { ReS, ReE } from "@services/generalHelper.service";
import { SUCCESS_CODE, SERVER_ERROR_CODE, BAD_REQUEST_CODE } from "@constants/serverCode";
import mongoose from "mongoose";

class BookController {
  async createBook(req: Request, res: Response) {
    try {
      const { title, author, genre, description } = req.body;

      if (!title || !author) {
        return ReE(res, BAD_REQUEST_CODE, "Title and author are required");
      }

      const newBook = await Book.create({
        title,
        author,
        genre,
        description,
      });

      return ReS(res, SUCCESS_CODE, "Book created successfully", newBook);
    } catch (error) {
      return ReE(res, SERVER_ERROR_CODE, `Error creating book: ${error}`);
    }
  }

 async getBooks(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', author, genre } = req.query as any;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};

    if (author) filter.author = genre;
    if (genre) filter.genre = genre;

    // Get books with pagination
     const [books, total] = await Promise.all([
      Book.find(filter).skip(skip).limit(limitNum).lean(),
      Book.countDocuments(filter),
    ]);

    // Response
    return ReS(res, SUCCESS_CODE, "Books fetched", {
      totalItems: total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: books,
    });

  } catch (error) {
    return ReE(res, SERVER_ERROR_CODE, `Error fetching books: ${error}`);
  }
}


  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if(!mongoose.Types.ObjectId.isValid(id) ) return ReE(res, BAD_REQUEST_CODE, "Invalid book ID format");
      const book = await Book.findById(new mongoose.Types.ObjectId(id)).lean();
      if (!book) return ReE(res, BAD_REQUEST_CODE, "Book not found");

      const reviews = await Review.find({ book: id }).populate("user", "username").lean();

      const avg = await Review.aggregate([
        { $match: { book: book._id } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]);

      return ReS(res, SUCCESS_CODE, "Book fetched", {
        book,
        averageRating: avg[0]?.avgRating || 0,
        reviews,
      });
    } catch (error) {
      return ReE(res, SERVER_ERROR_CODE, `Error getting book details: ${error}`);
    }
  }

  async updateBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, author, genre, description } = req.body;
      
      const book = await Book.findByIdAndUpdate(
        id,
        { title, author, genre, description },
        { new: true }
      ).lean();

      if (!book) return ReE(res, BAD_REQUEST_CODE, "Book not found");

      return ReS(res, SUCCESS_CODE, "Book updated successfully", book);
    } catch (error) {
      return ReE(res, SERVER_ERROR_CODE, `Error updating book: ${error}`);
    }
  }

  async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await Book.findByIdAndDelete(id).lean();
      if (!book) return ReE(res, BAD_REQUEST_CODE, "Book not found");
      await Review.deleteMany({ book: id });
      return ReS(res, SUCCESS_CODE, "Book deleted successfully");
    } catch (error) {
      return ReE(res, SERVER_ERROR_CODE, `Error deleting book: ${error}`);
    }
  }
  async searchBooks(req: Request, res: Response) {
    try {
      const { q } = req.query as any;
      if (!q) return ReE(res, BAD_REQUEST_CODE, "Search query is required");

      const books = await Book.find({
        $or: [
          { title: new RegExp(q, "i") },
          { author: new RegExp(q, "i") },
        ],
      }).lean();

      return ReS(res, SUCCESS_CODE, "Search results", books);
    } catch (error) {
      return ReE(res, SERVER_ERROR_CODE, `Error searching books: ${error}`);
    }
  }
}

export default new BookController();
