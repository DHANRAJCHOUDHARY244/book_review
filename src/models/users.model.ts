import { OtpType } from "@constants/common.enum";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  mobile_no: string;
  mobile_country_code: string;
  otp: {
    otp: number;
    otp_type: OtpType;
    expired_at: Date;
  };
  is_active: boolean;
  role: string;  // e.g., 'admin', 'user'
  is_verified: boolean;
  profile_image: string;
  otp_verification_token: string | null;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name:{
      type: String,
      minlength: 3, // Minimum length for name
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: false, // Optional username
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,   // Minimum length for password
    },
    mobile_no: {
      type: String,
      required: false, 
      trim: true,
    },
    mobile_country_code: {
      type: String,
      required: false, 
      trim: true,
    },
    otp: {
      otp: {
        type: Number,
        required: false,
      },
      otp_type: {
        type: String,
        required: false,
        enum: Object.values(OtpType), // Ensure otp_type is one of the defined OtpType values
      },
      expired_at: {
        type: Date,
        required: false,
      },
      is_active: {
        type: Boolean,
        default: false,
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"], // Define roles
      default: "user", // Default role
    },
    is_verified: {
      type: Boolean,
      default: false, // Default to not verified
    },
    profile_image: {
      type: String,
      required: false,
      trim: true, // Optional profile image URL   
    },
    otp_verification_token: {
      type: String,
      required: false,
      default: null, // Optional token for OTP verification
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
