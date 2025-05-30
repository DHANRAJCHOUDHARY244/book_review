import booksController from '@controllers/books.controller';
import reviewController from '@controllers/review.controller';
import express from 'express';
import { authenticate } from 'src/middleware/auth.middleware';
const router = express.Router();


// Routes
router.get("/", booksController.getBooks.bind(booksController));
router.get("/search", booksController.searchBooks.bind(booksController));
router.get("/:id", booksController.getBookById.bind(booksController));

router.use("/v1/*",authenticate.bind(authenticate))
router.post("/v1/add", booksController.createBook.bind(booksController));
router.put("/v1/:id", booksController.updateBook.bind(booksController));
router.post("/v1/:id/review",  reviewController.createReview.bind(reviewController));
router.delete("/v1/:id", booksController.deleteBook.bind(booksController));


export default router;