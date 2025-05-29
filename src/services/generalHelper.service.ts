const crypto = require('crypto');
import { ResponseData } from "@constants/common.interface";
import { Response } from "express";
import  bcrypt  from 'bcrypt';

export function ReS (res: Response, status: number, message: string, data?: any)  {
  const res_obj: ResponseData = { status, message, data };
  res.status(status).json(res_obj);
};

export function ReE (res:Response, status: number, message: string) {
  const res_obj: ResponseData = { status, message };
  res.status(status).json(res_obj);
}

export function  generate_6_Digit_Otp(){
  return Math.floor(100000 + Math.random() * 900000);
}

export function generate_Hash_Password(password:string){
  return bcrypt.hash(password, 10);
}

export function compare_Hash_Password(password:string, hashedPassword: string){
  return bcrypt.compare(password, hashedPassword);
}

// Function to generate an impossible-to-duplicate UUID
export function generateUUID() {
    const timestamp = Date.now().toString(36);  // Base36 timestamp (shorter & unique)
    const randomString = crypto.randomBytes(10).toString('hex'); // 20-char random string

    return `${timestamp}-${randomString}`;
}

