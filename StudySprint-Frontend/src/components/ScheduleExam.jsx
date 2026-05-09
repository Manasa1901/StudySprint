import { useState, useEffect } from "react";
import api from "../api/axios";

const ScheduleExam = ({ onAddExam, darkMode }) => {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reminder, setReminder] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const examDateTime = new Date(`${date}T${time}`);
    if (examDateTime <= new Date()) { setError("Exam date and time must be in the future."); return; }
    try {
      setLoading(true);
      const res = await api.post("/exams", { subject: subject.trim(), date, time, reminder, completed: false });
      if (res.data.exam) onAddExam(res.data.exam);
      setSubject(""); setDate(""); setTime(""); setReminder("1");
    } catch {
      setError("Failed to add exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
    darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"
  }`;

  return (
    <div className={`rounded-2xl border shadow-sm mb-5 overflow-hidden transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"} ${
      darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"
    }`}>
      <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700/60" : "border-gray-50"}`}>
        <h2 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>📅 Schedule Exam</h2>
      </div>

      <div className="p-6">
        {error && (
          <div className={`text-sm px-4 py-3 rounded-xl mb-4 ${
            darkMode ? "bg-red-900/30 text-red-400 border border-red-800/40" : "bg-red-50 text-red-600 border border-red-100"
          }`}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Subject</label>
            <input type="text" placeholder="e.g. Mathematics" className={inputCls} value={subject} onChange={e => setSubject(e.target.value)} required />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Date</label>
            <input type="date" className={inputCls} value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Time</label>
            <input type="time" className={inputCls} value={time} onChange={e => setTime(e.target.value)} required />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Reminder</label>
            <select className={inputCls} value={reminder} onChange={e => setReminder(e.target.value)}>
              <option value="1">1 Day Before</option>
              <option value="2">2 Days Before</option>
              <option value="7">1 Week Before</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-sm"
          >
            {loading ? "Saving..." : "Save Exam"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleExam;
