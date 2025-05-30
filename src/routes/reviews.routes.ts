import reviewController from '@controllers/review.controller';
import express from 'express';
import { authenticate } from 'src/middleware/auth.middleware';
const router = express.Router();

// Routes

// id=> bookId
router.get('/:id', reviewController.getReviews.bind(reviewController));

// id=> reviewId Authenticated routes
router.use("/v1/*",authenticate.bind(authenticate))
router.put('/v1/:id', reviewController.updateReview.bind(reviewController));
router.delete('/v1/:id', reviewController.deleteReview.bind(reviewController));

export default router;