// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { authService } from "./auth.service";

/**
 * Handle user login
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await authService.loginUser(email, password);
        res.json({ success: true, ...result });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};
