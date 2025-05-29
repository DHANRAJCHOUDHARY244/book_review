import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "@models/users.model";
import { sendEmailOtp } from "@services/email.service";
import {
  compare_Hash_Password,
  generate_6_Digit_Otp,
  generate_Hash_Password,
  ReE,
  ReS,
} from "@services/generalHelper.service";
import {
  BAD_REQUEST_CODE,
  RESOURCE_NOT_FOUND,
  SERVER_ERROR_CODE,
  SUCCESS_CODE,
} from "@constants/serverCode";
import { OtpType } from "@constants/common.enum";
import { faker } from "@faker-js/faker";
import { IUser } from "@constants/user.enterface";

class AuthController {
  private async getUserInfo(user_data: IUser, is_remember = false) {
    if (!user_data.profile_image) user_data.avatar = faker.image.avatarGitHub();
    else user_data.avatar = user_data.profile_image;

    const { password, otp, otp_verification_token, ...userInfo } = user_data;

    // Generate JWT Token with role inside payload
    const token = jwt.sign(
      { id: user_data._id, email: user_data.email, role: user_data.role },
      process.env.JWT_SECRET!,
      { expiresIn: is_remember ? "15d" : "1h" }
    );

    return {
      user: {
        username: userInfo.name,
        ...userInfo,
        role: user_data.role,
      },
      token,
    };
  }

  // Register User
  async register(req: Request, res: Response) {
    try {
      const {
        name,
        username,
        email,
        password,
        mobile_no,
        mobile_country_code,
        is_signup = true,
        role = "customer",
      } = req.body;

      // Check if user exists by email or username
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      }).lean();

      if (existingUser) return ReE(res, BAD_REQUEST_CODE, "User already exists");

      // Hash password
      const hashedPassword = await generate_Hash_Password(password);
      const genOtp = generate_6_Digit_Otp();

      // Create User with role field
      const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        mobile_no,
        mobile_country_code,
        otp: {
          otp: genOtp,
          otp_type: OtpType.VERIFY_EMAIL,
          expired_at: new Date(Date.now() + 60 * 1000),
          is_active: true,
        },
        role,
      });

      if (is_signup) {
        await sendEmailOtp(email, {
          title: "OTP Email Verification Code",
          otp: genOtp,
        });
      }

      return ReS(res, SUCCESS_CODE, "User registered successfully.");
    } catch (error: any) {
      console.error(error);
      return ReE(res, SERVER_ERROR_CODE, `Server Error: ${error.message || error}`);
    }
  }

  // Login User
  async login(req: Request, res: Response) {
    try {
      const { username, password, is_remember = false } = req.body;

      // Find user by email or username
      const user = await User.findOne({
        $or: [{ email: username }, { username }],
      }).lean();

      if (!user) return ReE(res, BAD_REQUEST_CODE, "Invalid credentials");

      // Compare Password
      const isMatch = await compare_Hash_Password(password, user.password);
      if (!isMatch) return ReE(res, BAD_REQUEST_CODE, "Invalid credentials");

      if (!user.is_verified) return ReE(res, BAD_REQUEST_CODE, "Email not verified");

      const resData = await this.getUserInfo({ ...user, _id: user._id.toString() }, is_remember);
      return ReS(res, SUCCESS_CODE, "Login successful", resData);
    } catch (error: any) {
      console.error(error);
      return ReE(res, SERVER_ERROR_CODE, `Server Error: ${error.message || error}`);
    }
  }

  // Reset Password Handler
  async reset_password_req(req: Request, res: Response) {
    try {
      const { new_password, old_password = null } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) return ReE(res, BAD_REQUEST_CODE, "Unauthorized");

      // Find user
      const user = await User.findById(userId);
      if (!user) return ReE(res, RESOURCE_NOT_FOUND, "User not found");

      // Validate old password if provided
      if (old_password) {
        const isMatch = await compare_Hash_Password(old_password, user.password);
        if (!isMatch) return ReE(res, BAD_REQUEST_CODE, "Old Password is incorrect");
      }

      if (!new_password) return ReE(res, BAD_REQUEST_CODE, "New password is required");

      const hashedPassword = await generate_Hash_Password(new_password);

      user.password = hashedPassword;
      user.otp_verification_token = null;

      await user.save();

      const resData = await this.getUserInfo({ ...user.toObject(), _id: user._id.toString() });

      return ReS(res, SUCCESS_CODE, "Password reset successfully.", resData);
    } catch (error: any) {
      console.error(error);
      return ReE(res, SERVER_ERROR_CODE, `Server Error: ${error.message || error}`);
    }
  }

  // Verify Email
  async verify_Email(req: Request, res: Response) {
    try {
      const { email, otp, resend } = req.body;

      const user = await User.findOne({ email });

      if (!user) return ReE(res, RESOURCE_NOT_FOUND, "User not found");

      if (user.is_verified) return ReE(res, BAD_REQUEST_CODE, "Email already verified");

      if (resend) {
        const genOtp = generate_6_Digit_Otp();
        user.otp = {
          otp: genOtp,
          otp_type: OtpType.VERIFY_EMAIL,
          expired_at: new Date(Date.now() + 60 * 1000),
          is_active: true,
        };
        await user.save();
        await sendEmailOtp(email, { title: "OTP Email Verification Code", otp: genOtp });
        return ReS(res, SUCCESS_CODE, "Otp sent to your email");
      }

      if (!otp) return ReE(res, BAD_REQUEST_CODE, "Otp is required");

      const otpData = user.otp;

      if (
        !otpData ||
        parseInt(otp) !== otpData.otp ||
        new Date(otpData.expired_at) < new Date() ||
        otpData.otp_type !== OtpType.VERIFY_EMAIL
      )
        return ReE(res, BAD_REQUEST_CODE, "Invalid or expired otp");

      user.is_verified = true;
      user.otp = undefined;
      await user.save();

      const resData = await this.getUserInfo({ ...user.toObject(), _id: user._id.toString() });

      return ReS(res, SUCCESS_CODE, "Email verified successfully.", resData);
    } catch (error: any) {
      console.error(error);
      return ReE(res, SERVER_ERROR_CODE, `Server Error: ${error.message || error}`);
    }
  }

  // Verify Forgot Password OTP
  async verify_forgot_password_otp(req: Request, res: Response) {
    try {
      const { email, otp, resend } = req.body;
      const user = await User.findOne({ email });

      if (!user) return ReE(res, RESOURCE_NOT_FOUND, "User not found");

      if (resend) {
        const genOtp = generate_6_Digit_Otp();
        user.otp = {
          otp: genOtp,
          otp_type: OtpType.FORGOT_PASSWORD,
          expired_at: new Date(Date.now() + 60 * 1000),
          is_active: true,
        };
        await user.save();
        await sendEmailOtp(email, { title: "OTP Forgot Password Code", otp: genOtp });
        return ReS(res, SUCCESS_CODE, "Otp sent to your email");
      }

      if (!otp) return ReE(res, BAD_REQUEST_CODE, "Otp is required");

      const otpData = user.otp;

      if (
        !otpData ||
        otp !== otpData.otp.toString() ||
        new Date(otpData.expired_at) < new Date() ||
        otpData.otp_type !== OtpType.FORGOT_PASSWORD
      )
        return ReE(res, BAD_REQUEST_CODE, "Invalid or expired otp");

      // Generate OTP verification token (1 min expiry)
      const otpToken = jwt.sign(
        { id: user._id, email: user.email, otp_type: OtpType.FORGOT_PASSWORD },
        process.env.JWT_SECRET!,
        { expiresIn: "1m" }
      );

      user.otp_verification_token = otpToken;
      user.otp = undefined;
      await user.save();

      return ReS(res, SUCCESS_CODE, "Otp verified successfully", { token: otpToken });
    } catch (error: any) {
      console.error(error);
      return ReE(res, SERVER_ERROR_CODE, `Server Error: ${error.message || error}`);
    }
  }
}

export default new AuthController();
