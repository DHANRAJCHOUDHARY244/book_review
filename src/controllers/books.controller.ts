// src/controllers/book.controller.ts
import { Request, Response } from "express";
import Book from "@models/book.model";
import Review from "@models/review.model";
import { ReS, ReE } from "@services/generalHelper.service";
import { SUCCESS_CODE, SERVER_ERROR_CODE, BAD_REQUEST_CODE } from "@constants/serverCode";

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
      const { page = 1, limit = 10, author, genre } = req.query as any;
      const filter: Record<string, any> = {};
      if (author) filter.author = new RegExp(author, "i");
      if (genre) filter.genre = new RegExp(genre, "i");

      const skip = (Number(page) - 1) * Number(limit);
      const [books, total] = await Promise.all([
        Book.find(filter).skip(skip).limit(Number(limit)).lean(),
        Book.countDocuments(filter),
      ]);

      return ReS(res, SUCCESS_CODE, "Books fetched", {
        totalItems: total,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        data: books,
      });
    } catch (error) {
      return ReE(res, SERVER_ERROR_CODE, `Error fetching books: ${error}`);
    }
  }

  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await Book.findById(id).lean();
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
