import { Router } from "express";
import * as authController from "./auth.controller";

const router = Router();

// Login endpoint
router.post('/login', authController.login);

export const authRoutes = router;