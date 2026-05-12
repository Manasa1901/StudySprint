import express from "express";
import { createTopic, toggleDone, deleteTopic, updateNotes, renameTopic } from "../controllers/TopicController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTopic);
router.patch("/toggle/:id", authMiddleware, toggleDone);
router.patch("/notes/:id", authMiddleware, updateNotes);
router.patch("/rename/:id", authMiddleware, renameTopic);
router.delete("/:id", authMiddleware, deleteTopic);

export default router;
