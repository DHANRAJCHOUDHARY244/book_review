export interface IUser {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  mobile_no?: string;
  mobile_country_code?: string;
  otp?: {
    otp?: number;
    otp_type?: string;
    expired_at?: Date;
  };
  role?: string;  // e.g., 'admin', 'user'
  is_verified?: boolean;
  profile_image?: string;
  avatar?: string;
  otp_verification_token?: string | null;
}
