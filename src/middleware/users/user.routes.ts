import express from "express";
import { createUser, deleteUser, getAllUsers, getSingleUser, updateUser } from "./users.controller";

const router = express.Router();

router.post("/",createUser);

router.get("/", getAllUsers)

router.get("/:id", getSingleUser)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)

export  const  userRoutes = router;