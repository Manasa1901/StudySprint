import Exam from "../models/Exam.js";

export const createExam = async (req, res) => {
  try {
    const { subject, date, time, reminder } = req.body;
    const userId = req.userData.id;

    const exam = await Exam.create({
      subject,
      date,
      time,
      reminder,
      user: userId
    });

    res.status(201).json({ exam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userData.id;

    const exam = await Exam.findOne({ _id: id, user: userId });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    await Exam.deleteOne({ _id: id });

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExams = async (req, res) => {
  try {
    const userId = req.userData.id;
    const exams = await Exam.find({ user: userId }).sort({ date: 1 });
    res.status(200).json({ exams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
