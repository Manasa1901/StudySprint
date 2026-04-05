import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import ConfirmDialog from "./ConfirmDialog";

const TopicList = ({ data, setData, darkMode }) => {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, topicId: null, topicName: "", subject: "" });

  /* ---------- SUBJECT PROGRESS ---------- */
  const getProgress = (topics) => {
    const done = topics.filter((t) => t.done).length;
    const total = topics.length;

    return {
      done,
      total,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  };

  /* ---------- TOGGLE DONE (BACKEND) ---------- */
  const toggleDone = async (topicId, subjectName) => {
    try {
      const res = await api.patch(`/topics/${topicId}/toggle`);
      const updatedTopic = res.data.topic;

      // ✅ Update UI instantly
      setData((prev) => ({
        ...prev,
        [subjectName]: prev[subjectName].map((t) =>
          t._id === updatedTopic._id ? updatedTopic : t
        ),
      }));
    } catch (err) {
      console.error(
        "Toggle failed:",
        err.response?.data || err.message
      );
      toast.error("Failed to update topic");
    }
  };

  /* ---------- DELETE TOPIC ---------- */
  const handleDeleteTopic = async () => {
    try {
      await api.delete(`/topics/${deleteDialog.topicId}`);
      
      // Remove from local state
      setData((prev) => ({
        ...prev,
        [deleteDialog.subject]: prev[deleteDialog.subject].filter(
          (t) => t._id !== deleteDialog.topicId
        ),
      }));

      toast.success("Topic deleted successfully");
      setDeleteDialog({ isOpen: false, topicId: null, topicName: "", subject: "" });
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      toast.error("Failed to delete topic");
    }
  };

  const openDeleteDialog = (topicId, topicName, subject) => {
    setDeleteDialog({ isOpen: true, topicId, topicName, subject });
  };

  return (
    <div>
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Topic"
        message={`Are you sure you want to delete "${deleteDialog.topicName}"? This action cannot be undone.`}
        onConfirm={handleDeleteTopic}
        onCancel={() => setDeleteDialog({ isOpen: false, topicId: null, topicName: "", subject: "" })}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        darkMode={darkMode}
      />

      {Object.keys(data).length === 0 && (
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No subjects added yet 📚
        </p>
      )}

      {Object.entries(data).map(([subject, topics]) => {
        const progress = getProgress(topics);

        return (
          <div
            key={subject}
            className={`p-6 rounded-xl shadow mb-6 transition-all duration-400 ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"}`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-xl font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                {subject}
              </h3>
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {progress.done}/{progress.total} completed (
                {progress.percentage}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className={`w-full rounded-full h-2 mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            {/* Topics */}
            {topics.map((topic) => (
              <div
                key={topic._id}
                className={`flex items-center gap-3 mb-3 p-2 rounded transition ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
              >
                <input
                  type="checkbox"
                  checked={topic.done}
                  onChange={() =>
                    toggleDone(topic._id, subject)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />

                <span
                  className={
                    topic.done
                      ? `line-through flex-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`
                      : `flex-1 ${darkMode ? "text-gray-300" : "text-gray-800"}`
                  }
                >
                  {topic.name}
                </span>

                <button
                  onClick={() => openDeleteDialog(topic._id, topic.name, subject)}
                  className={`px-2 py-1 rounded transition text-sm ${darkMode ? "text-red-400 hover:text-red-300 hover:bg-red-900/30" : "text-red-500 hover:text-red-700 hover:bg-red-50"}`}
                  title="Delete topic"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TopicList;
