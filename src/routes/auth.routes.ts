import express from "express";
import authController from "@controllers/auth.controller";
import { authenticate } from 'src/middleware/auth.middleware';

const router = express.Router();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/verify-email", authController.verify_Email.bind(authController));
router.post("/verify-forgot-password-otp", authController.verify_forgot_password_otp.bind(authController));

// Authenticated routes
router.use("/v1/*",authenticate.bind(authenticate))
router.post("/v1/reset-password", authController.reset_password_req.bind(authController));

export default router;
