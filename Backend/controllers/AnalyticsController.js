import Topic from "../models/Topic.js";

export const getHeatmapData = async (req, res) => {
  try {
    const userId = req.userData.id;

    const topics = await Topic.find({
      user: userId,
      done: true,
    });

    const heatmap = {};

    topics.forEach((topic) => {
      const date = topic.updatedAt.toISOString().split("T")[0];
      heatmap[date] = (heatmap[date] || 0) + 1;
    });

    res.status(200).json({ heatmap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
