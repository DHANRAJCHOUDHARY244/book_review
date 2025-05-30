import express from 'express';
const router = express.Router();
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import reviewRoutes from './reviews.routes';
import userRoutes from './user.routes';
import { authenticate } from 'src/middleware/auth.middleware';

router.use('/auth', authRoutes);
router.use('/books',bookRoutes);
router.use('/reviews', reviewRoutes);
router.use("/v1/*",authenticate.bind(authenticate))
router.use('/v1/users', userRoutes); 


export default router;