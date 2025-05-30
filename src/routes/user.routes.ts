import express from 'express';
const router = express.Router();
import userController from '@controllers/user.controller';

// Routes
router.delete('/delete', userController.deleteUser.bind(userController));
router.post('/update-profile-image', userController.updateProfileImage.bind(userController));
router.post('/update-user', userController.updateUser.bind(userController));


export default router;