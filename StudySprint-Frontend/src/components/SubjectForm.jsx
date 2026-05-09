import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const SubjectForm = ({ data, setData, darkMode }) => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const validate = (value, field) => {
    if (!value.trim()) return `${field} is required`;
    if (!/[a-zA-Z]/.test(value)) return `${field} must contain at least one letter`;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subjectError = validate(subject, "Subject");
    const topicError = validate(topic, "Topic");
    if (subjectError || topicError) { setErrors({ subject: subjectError, topic: topicError }); return; }

    try {
      setLoading(true);
      const res = await api.post("/topics", { subjectName: subject.trim(), topicName: topic.trim() });
      setData(prev => {
        const updated = { ...prev };
        if (!updated[subject.trim()]) updated[subject.trim()] = [];
        updated[subject.trim()].push({ _id: res.data.topic._id, name: topic.trim(), done: false, updatedAt: new Date().toISOString() });
        return updated;
      });
      setSubject(""); setTopic(""); setErrors({});
      toast.success("Topic added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (hasError) => `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
    hasError
      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
      : darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 rounded-2xl border shadow-sm mb-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"} ${
        darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"
      }`}
    >
      <h3 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Add Topic
      </h3>

      <div className="mb-3">
        <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Subject</label>
        <input
          type="text"
          placeholder="e.g. Mathematics"
          className={inputCls(errors.subject)}
          value={subject}
          onChange={e => { setSubject(e.target.value); if (errors.subject) setErrors(p => ({ ...p, subject: "" })); }}
        />
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
      </div>

      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Topic</label>
          <input
            type="text"
            placeholder="e.g. Calculus"
            className={inputCls(errors.topic)}
            value={topic}
            onChange={e => { setTopic(e.target.value); if (errors.topic) setErrors(p => ({ ...p, topic: "" })); }}
          />
          {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-sm whitespace-nowrap"
        >
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
