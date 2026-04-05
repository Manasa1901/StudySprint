import express from "express";
import { createTopic, toggleDone, deleteTopic } from "../controllers/TopicController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/* Create a topic (auto-creates subject if needed) */
router.post("/", authMiddleware, createTopic);

/* Toggle topic completion (by topic ID) */
router.patch("/:id/toggle", authMiddleware, toggleDone);

/* Delete a topic */
router.delete("/:id", authMiddleware, deleteTopic);

export default router;
