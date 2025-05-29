import { Request } from "express";

export interface Error {
  stack?: string;
}

export interface CustomEmailContent{
  title: string;
  description: string;
}

export interface OtpContentData{
  otp: number;
  title: string;
}

export interface AuthenticatedRequest extends Request {
  [x: string]: {};
  user?: any;
}
export interface ResponseData {
  status: number;
  message: string;
  data?: any;
}