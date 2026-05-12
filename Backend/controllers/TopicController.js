import Topic from '../models/Topic.js';
import Subject from '../models/Subject.js';

export const createTopic = async (req, res) => {
  try {
    const { subjectName, topicName } = req.body;
    const userId = req.userData.id;
    let subject = await Subject.findOne({ name: subjectName, user: userId });
    if (!subject) {
      subject = await Subject.create({ name: subjectName, user: userId });
    }
    const topic = await Topic.create({
      name: topicName,
      subject: subject._id,
      user: userId
    });
    res.status(201).json({ topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userData.id;

    const topic = await Topic.findOne({ _id: id, user: userId });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await Topic.deleteOne({ _id: id });

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const userId = req.userData.id;

    const topic = await Topic.findOne({ _id: id, user: userId });
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    topic.notes = notes ?? "";
    await topic.save();
    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renameTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.userData.id;

    if (!name || !name.trim()) return res.status(400).json({ message: "Name cannot be empty" });

    const topic = await Topic.findOne({ _id: id, user: userId });
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    topic.name = name.trim();
    await topic.save();
    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleDone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userData.id;

    const topic = await Topic.findOne({ _id: id, user: userId });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    topic.done = !topic.done;
    await topic.save();
    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};