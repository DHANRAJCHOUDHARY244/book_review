import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ReE } from "@services/generalHelper.service";
import { UNAUTHORIZED_CODE } from "@constants/serverCode";
import { AuthenticatedRequest } from "@constants/common.interface";

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers['token'];
  try {
    if (!token) return ReE(res, UNAUTHORIZED_CODE, "Unauthorized");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    ReE(res,UNAUTHORIZED_CODE,"Invalid token");
  }
};
