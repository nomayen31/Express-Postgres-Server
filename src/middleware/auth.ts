// src/middleware/authMiddleware.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwtSecrite";
import { JwtPayloadExt } from "./auth/auth.middleware";

// Convert jwt.verify into a Promise-based function
const verifyTokenAsync = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};
export const authMiddleware = (requiredRole?: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = (await verifyTokenAsync(token, jwtSecret)) as JwtPayloadExt;
      req.user = decoded;
      // Check role if required
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          return res.status(403).json({
            success: false,
            message: `Forbidden - Requires one of the following roles: ${allowedRoles.join(', ')}`,
          });
        }
      }
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default authMiddleware;
