import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';

export const getSubjects = async (req, res) => {
  try {
    const userId = req.userData.id;
    const topics = await Topic.find({ user: userId }).populate('subject');
    const data = {};
    topics.forEach(topic => {
      const subjName = topic.subject.name;
      if (!data[subjName]) data[subjName] = [];
      data[subjName].push({ name: topic.name, done: topic.done, _id: topic._id, updatedAt: topic.updatedAt });
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userData.id;
    const existing = await Subject.findOne({ name, user: userId });
    if (existing) {
      return res.status(400).json({ message: 'Subject already exists' });
    }
    const subject = await Subject.create({ name, user: userId });
    res.status(201).json({ subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};