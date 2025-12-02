// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayloadExt {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

// You may extend Request type in your project instead of `any`
export const authMiddleware = (req: Request & { user?: JwtPayloadExt }, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ success: false, message: "JWT secret not configured" });

    const decoded = jwt.verify(token, secret) as JwtPayloadExt;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
