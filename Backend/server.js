import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import User from "./models/User.js";
import examRoutes from "./routes/examRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["https://study-sprint-wine.vercel.app", "http://localhost:3000"], // Allow Vercel frontend and local development
  credentials: true
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/subjects", subjectRoutes);
app.use("/topics", topicRoutes);
app.use("/exams", examRoutes);
app.use("/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userData.id).select("-password");
  res.status(200).json({ message: "Profile", userData: user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
