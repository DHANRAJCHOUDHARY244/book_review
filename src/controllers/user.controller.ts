import {
  BAD_REQUEST_CODE,
  FORBIDDEN_CODE,
  SERVER_ERROR_CODE,
  SUCCESS_CODE,
} from "@constants/serverCode";
import { generateUUID, ReE, ReS } from "@services/generalHelper.service";
import { Response } from "express";
import { AuthenticatedRequest } from "@constants/common.interface";
import { s3Service } from "@services/s3.service";
import fileUpload from "express-fileupload";
import User from "@models/users.model"; // Mongoose User model

class UserController {
  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.body;
      const { user } = req;

      if (!userId) return ReE(res, FORBIDDEN_CODE, "userId is required");
      if (user._id.toString() === userId)
        return ReE(res, FORBIDDEN_CODE, "You can't delete yourself");

      const userToDelete = await User.findById(userId);
      if (!userToDelete)
        return ReE(res, BAD_REQUEST_CODE, "User not found");

      await User.findByIdAndDelete(userId);
      return ReS(res, SUCCESS_CODE, "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }

  async updateProfileImage(req: AuthenticatedRequest, res: Response) {
    try {
      const files = req.files as fileUpload.FileArray;
      const { user } = req;

      if (!files || !files.files)
        return ReE(res, FORBIDDEN_CODE, "No file uploaded.");

      const file = files.files as fileUpload.UploadedFile;
      const file_name = "profile-image-" + generateUUID();

      const fileUrl = await s3Service.uploadFile(
        file.data,
        file_name,
        file.mimetype,
      );

      const oldImageUrl = user.profile_image;

      // Update profile image in DB
      await User.findByIdAndUpdate(user._id, {
        profile_image: fileUrl,
      });

      // Delete old image from S3 if it exists
      if (oldImageUrl) {
        const url = new URL(oldImageUrl);
        const key = decodeURIComponent(url.pathname.slice(1)); // Remove leading slash
        await s3Service.deleteFile(key);
      }

      return ReS(res, SUCCESS_CODE, "Profile image updated successfully", {
        profile_image: fileUrl,
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      return ReE(res, SERVER_ERROR_CODE, `Server Error: ${error}`);
    }
  }

  async editUser(req: AuthenticatedRequest, res: Response) {
    try {
      // Add your logic for editing user info here
      const {} = req.body;
    } catch (error) {
      console.error("Error in updating users:", error);
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }
}

export default new UserController();
