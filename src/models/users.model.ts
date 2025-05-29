import mongoose, { Document, Schema } from "mongoose";



const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile_no: { type: String },
    mobile_country_code: { type: String },
    otp: {
      otp: Number,
      otp_type: String,
      expired_at: Date,
      is_active: { type: Boolean, default: true },
    },
    role: { type: String, default: "customer" },
    is_verified: { type: Boolean, default: false },
    profile_image: String,
    avatar: String,
    otp_verification_token: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
