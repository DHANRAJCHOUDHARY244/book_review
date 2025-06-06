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
import logger from "@utils/pino";

class UserController {
  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { user } = req;
      const { id: userId } = user;
      if (!userId) return ReE(res, FORBIDDEN_CODE, "userId is required");
      const userToDelete = await User.findById(userId);
      if (!userToDelete)
        return ReE(res, BAD_REQUEST_CODE, "User not found");

      await User.findByIdAndDelete(userId);
      return ReS(res, SUCCESS_CODE, "User deleted successfully");
    } catch (error) {
       logger.error(`Error deleting user: ${error}`)
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }

  async updateProfileImage(req: AuthenticatedRequest, res: Response) {
    try {
      const files = req.files as fileUpload.FileArray;
      const { user } = req;

      if (!files || !files.files)
        return ReE(res, FORBIDDEN_CODE, "No file uploaded.");

      const userData = await User.findById(user._id).lean();
      const file = files.files as fileUpload.UploadedFile;
      const file_name = "profile-image-" + generateUUID();

      const fileUrl = await s3Service.uploadFile(
        file.data,
        file_name,
        file.mimetype,
      );


      const oldImageUrl = userData?.profile_image;
      await User.findByIdAndUpdate(user.id, {
        profile_image: fileUrl,
      });

      // Update profile image in DB

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
       logger.error(`Error updating profile image: ${error}`)
      return ReE(res, SERVER_ERROR_CODE, `Server Error: ${error}`);
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, email, mobile_no, mobile_country_code } = req.body;
      const { user } = req;
      const { id:userId } = user;
      if (!userId) return ReE(res, FORBIDDEN_CODE, "userId is required");

      const userToUpdate = await User.findById(userId);
      if (!userToUpdate) return ReE(res, BAD_REQUEST_CODE, "User not found");

      // Update user details
      userToUpdate.name = name || userToUpdate.name;
      userToUpdate.email = email || userToUpdate.email;
      userToUpdate.mobile_no = mobile_no || userToUpdate.mobile_no;
      userToUpdate.mobile_country_code =
      mobile_country_code || userToUpdate.mobile_country_code;

      await userToUpdate.save();

      return ReS(res, SUCCESS_CODE, "User updated successfully", {
        user: userToUpdate,
      });
    } catch (error) {
       logger.error(`Error in updating users: ${error}`)
      return ReE(res, SERVER_ERROR_CODE, "Something went wrong");
    }
  }
}

export default new UserController();
