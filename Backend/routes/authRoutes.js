import express from "express";
import { registerUser, loginUser, updateUsername } from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/update-name", authMiddleware, updateUsername);

export default router;
