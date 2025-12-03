// src/config/jwtSecrite.ts
import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || "sgfdgjbkfdhoiawflms afk-fdjgklhvhflihaslknfafjasf";

if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not defined in environment variables. Using default secret.");
}
