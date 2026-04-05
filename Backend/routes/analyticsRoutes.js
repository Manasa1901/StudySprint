import express from "express";
import { getHeatmapData } from "../controllers/AnalyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/heatmap", authMiddleware, getHeatmapData);

export default router;
