import { Request, Response } from "express";
import Review, { IReview } from "@models/review.model";
import Book from "@models/book.model";
import { AuthenticatedRequest } from "@constants/common.interface";
import { ReE, ReS } from "@services/generalHelper.service";
import {
  BAD_REQUEST_CODE,
  FORBIDDEN_CODE,
  SERVER_ERROR_CODE,
  SUCCESS_CODE,
  RESOURCE_NOT_FOUND,
} from "@constants/serverCode";

class ReviewController {
  // Create a new review (one review per user per book)
  async createReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: bookId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user?.id;

      if (!rating || rating < 1 || rating > 5)
        return ReE(res, BAD_REQUEST_CODE, "Rating must be between 1 and 5");
      if (!comment) return ReE(res, BAD_REQUEST_CODE, "Comment is required");

      // Check if book exists
      const book = await Book.findById(bookId);
      if (!book) return ReE(res, RESOURCE_NOT_FOUND, "Book not found");

      // Check if user already reviewed this book
      const existingReview = await Review.findOne({ book: bookId, user: userId });
      if (existingReview)
        return ReE(res, FORBIDDEN_CODE, "You have already reviewed this book");

      // Create new review
      const review = new Review({
        book: bookId,
        user: userId,
        rating,
        comment,
      });

      await review.save();

      // Add review to book's reviews array
      book.reviews.push(review._id as typeof book.reviews[0]);

      // Recalculate average rating
      const reviews = await Review.find({ book: bookId });
      const avgRating =
        reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
      book.averageRating = avgRating;

      await book.save();

      return ReS(res, SUCCESS_CODE, "Review created successfully", review);
    } catch (error) {
      console.error("Error creating review:", error);
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }

  // Update a review (only by owner)
  async updateReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user?.id;

      const review = await Review.findById(reviewId);
      if (!review) return ReE(res, RESOURCE_NOT_FOUND, "Review not found");

      if (review.user.toString() !== userId)
        return ReE(res, FORBIDDEN_CODE, "You can only update your own review");

      if (rating && (rating < 1 || rating > 5))
        return ReE(res, BAD_REQUEST_CODE, "Rating must be between 1 and 5");

      if (rating) review.rating = rating;
      if (comment) review.comment = comment;

      await review.save();

      // Recalculate average rating for the book
      const book = await Book.findById(review.book);
      if (book) {
        const reviews = await Review.find({ book: book._id });
        const avgRating =
          reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
        book.averageRating = avgRating;
        await book.save();
      }

      return ReS(res, SUCCESS_CODE, "Review updated successfully", review);
    } catch (error) {
      console.error("Error updating review:", error);
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }

  // Delete a review (only by owner)
  async deleteReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: reviewId } = req.params;
      const userId = req.user?.id;

      const review = await Review.findById(reviewId);
      if (!review) return ReE(res, RESOURCE_NOT_FOUND, "Review not found");

      if (review.user.toString() !== userId)
        return ReE(res, FORBIDDEN_CODE, "You can only delete your own review");

      await review.deleteOne();

      // Remove review from book's reviews array and update average rating
      const book = await Book.findById(review.book);
      if (book) {
        book.reviews = book.reviews.filter((r) => r.toString() !== reviewId);
        const reviews = await Review.find({ book: book._id });
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
            : 0;
        book.averageRating = avgRating;
        await book.save();
      }

      return ReS(res, SUCCESS_CODE, "Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }

  // Get reviews for a book (with pagination)
  async getReviews(req: Request, res: Response) {
    try {
      const { id: bookId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Check if book exists
      const book = await Book.findById(bookId);
      if (!book) return ReE(res, RESOURCE_NOT_FOUND, "Book not found");

      // Get reviews with pagination and populate user info if needed
      const reviews = await Review.find({ book: bookId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalReviews = await Review.countDocuments({ book: bookId });
      const totalPages = Math.ceil(totalReviews / limit);

      return ReS(res, SUCCESS_CODE, "Reviews fetched successfully", {
        reviews,
        totalReviews,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }
}

export default new ReviewController();
