import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reminder: { type: Number, default: 1 }, // days before
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
