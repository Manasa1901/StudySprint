import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios"; // axios instance with token

const SubjectForm = ({ data, setData, darkMode }) => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const validateField = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} is required`;
    if (!/[a-zA-Z]/.test(value))
      return `${fieldName} must contain at least one letter`;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectError = validateField(subject, "Subject");
    const topicError = validateField(topic, "Topic");

    if (subjectError || topicError) {
      setErrors({
        subject: subjectError,
        topic: topicError,
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ Single API call (backend auto-creates subject if needed)
      const res = await api.post("/topics", {
        subjectName: subject.trim(),
        topicName: topic.trim(),
      });

      setSubject("");
      setTopic("");
      setErrors({});

      // Optimistically update local state
      setData((prev) => {
        const updated = { ...prev };
        if (!updated[subject.trim()]) {
          updated[subject.trim()] = [];
        }
        updated[subject.trim()].push({
          _id: res.data.topic._id,
          name: topic.trim(),
          done: false,
          updatedAt: new Date().toISOString(),
        });
        return updated;
      });

      toast.success("Topic added successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 rounded-xl shadow mb-8 transition-all duration-500 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"} ${darkMode ? "bg-gray-900" : "bg-white"}`}
    >
      {/* SUBJECT INPUT */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Subject"
          className={`border p-2 rounded w-full transition-colors ${
            errors.subject
              ? "border-red-500"
              : darkMode
              ? "border-gray-700 bg-gray-800 text-white placeholder-gray-500"
              : "border-gray-300 bg-white text-gray-900"
          }`}
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            if (errors.subject) setErrors({ ...errors, subject: "" });
          }}
        />
        {errors.subject && (
          <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors.subject}</p>
        )}
      </div>

      {/* TOPIC INPUT */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Topic"
            className={`border p-2 rounded w-full transition-colors ${
              errors.topic
                ? "border-red-500"
                : darkMode
                ? "border-gray-700 bg-gray-800 text-white placeholder-gray-500"
                : "border-gray-300 bg-white text-gray-900"
            }`}
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (errors.topic) setErrors({ ...errors, topic: "" });
            }}
          />
          {errors.topic && (
            <p className={`text-sm mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`}>{errors.topic}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`text-white px-4 rounded disabled:opacity-60 transition-colors duration-200 ${darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"}`}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
