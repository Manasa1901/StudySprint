import express from "express";
import { createExam, getExams, deleteExam } from "../controllers/ExamController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createExam);
router.get("/", authMiddleware, getExams);
router.delete("/:id", authMiddleware, deleteExam);

export default router;
