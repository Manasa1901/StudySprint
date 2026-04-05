import { useState, useEffect } from "react";
import api from "../api/axios"; // Axios instance with auth token

const ScheduleExam = ({ onAddExam }) => {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reminder, setReminder] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Validate that exam date & time is in the future
  const validateDate = (selectedDate, selectedTime) => {
    const now = new Date();
    const examDateTime = new Date(`${selectedDate}T${selectedTime}`);
    return examDateTime > now;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateDate(date, time)) {
      setError("Exam date and time must be in the future.");
      return;
    }

    const examData = {
      subject: subject.trim(),
      date,
      time,
      reminder,
      completed: false,
    };

    try {
      setLoading(true);
      const res = await api.post("/exams", examData); // Save to backend
      if (res.data.exam) {
        onAddExam(res.data.exam); // Update parent state
      }

      // Reset form
      setSubject("");
      setDate("");
      setTime("");
      setReminder("1");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to add exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow mb-6 transition-all duration-500 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
      <h2 className="text-xl font-semibold mb-4">📅 Schedule Exam</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Subject Name"
          className="border p-2 rounded transition focus:ring-2 focus:ring-blue-400"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <input
          type="date"
          className="border p-2 rounded transition focus:ring-2 focus:ring-blue-400"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="time"
          className="border p-2 rounded transition focus:ring-2 focus:ring-blue-400"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded transition focus:ring-2 focus:ring-blue-400"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        >
          <option value="1">1 Day Before</option>
          <option value="2">2 Days Before</option>
          <option value="7">1 Week Before</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "opacity-60 cursor-not-allowed" : ""
          } bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200 md:col-span-2`}
        >
          {loading ? "Saving..." : "Save Exam"}
        </button>
      </form>
    </div>
  );
};

export default ScheduleExam;
