import express from "express";
import { createUser, deleteUser, getAllUsers, getSingleUser, updateUser } from "./users.controller";
import logger from "../logger";
import { authMiddleware } from "../auth";

const router = express.Router();

router.post("/", createUser);

router.get("/", logger, authMiddleware('admin'), getAllUsers)

router.get("/:id", authMiddleware(['admin', 'user']), getSingleUser)

router.put("/:id", authMiddleware('admin'), updateUser)

router.delete("/:id", authMiddleware('admin'), deleteUser)

export const userRoutes = router;